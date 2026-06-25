import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

function App() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setFetching(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/users`)
      setUsers(response.data)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load users.' })
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  const handleSubmitUser = async (e) => {
    e.preventDefault()
    setErrors({})
    setMessage(null)

    let validationErrors = {}
    if (!name.trim()) {
      validationErrors.name = 'Name is required'
    }
    if (!email.trim()) {
      validationErrors.email = 'Email is required'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      if (editingUser) {
        const response = await axios.put(`${API_BASE_URL}/users/${editingUser.id}`, { name, email })
        setUsers((prev) => prev.map((u) => u.id === editingUser.id ? response.data : u))
        setEditingUser(null)
        setMessage({ type: 'success', text: 'User updated successfully!' })
      } else {
        const response = await axios.post(`${API_BASE_URL}/users`, { name, email })
        setUsers((prev) => [response.data, ...prev])
        setMessage({ type: 'success', text: 'User added successfully!' })
      }
      setName('')
      setEmail('')
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const apiErrors = err.response.data.errors
        const formattedErrors = {}
        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = apiErrors[key][0]
        })
        setErrors(formattedErrors)
      } else {
        setMessage({ type: 'error', text: editingUser ? 'Failed to update user.' : 'Failed to add user.' })
        console.error(err)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (user) => {
    setEditingUser(user)
    setName(user.name)
    setEmail(user.email)
    setErrors({})
    setMessage(null)
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setName('')
    setEmail('')
    setErrors({})
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`)
      setUsers((prev) => prev.filter((user) => user.id !== id))
      setMessage({ type: 'success', text: 'User deleted successfully.' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete user.' })
      console.error(err)
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>User Management Page</h1>
        <p>A simple list of registered users and user creation form.</p>
      </header>

      {message && (
        <div className={`message-box ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="app-main">
        <section className="form-section">
          <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
          <form onSubmit={handleSubmitUser}>
            <div className="form-group">
              <label htmlFor="name-input">Name:</label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email-input">Email:</label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <button type="submit" disabled={loading}>
              {loading ? (editingUser ? 'Updating...' : 'Adding...') : (editingUser ? 'Save Changes' : 'Add User')}
            </button>
            {editingUser && (
              <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>User List</h2>
            <button onClick={fetchUsers} disabled={fetching}>
              {fetching ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {fetching && users.length === 0 ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users registered yet.</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.created_at).toLocaleString()}</td>
                    <td>{new Date(user.updated_at).toLocaleString()}</td>
                    <td>
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="btn-update"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
