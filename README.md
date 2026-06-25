# UserSync - User Management Portal

UserSync is a lightweight, self-contained user management web application built with a decoupled architecture consisting of a React Single Page Application (SPA) frontend and a Laravel RESTful API backend. Operating on a file-based SQLite database, the system implements full CRUD functionality (Create, Read, Update, Delete) to display and manage user profiles in real-time. It features robust client-side and server-side validation rules—ensuring required fields and database-level email uniqueness—with immediate UI feedback on form submissions. Designed for high portability, the repository includes a local, portable PHP and Composer environment configuration, allowing the entire application stack to be run instantly on Windows machines without any global installations or system modifications.

The frontend is built using React and Vite, utilizing Axios for stateless HTTP communications. It renders a clean, responsive layout utilizing system fonts and a simplified CSS design. The user table dynamically displays registered users along with their unique ID, name, email, creation timestamp, and update timestamp. Users can be created through an intuitive input form, deleted with confirmation dialogs, or updated using inline actions that load their current values into the editor for instant modification.

On the backend, Laravel maps these actions to discrete REST API endpoints. The controller handles database operations using Eloquent ORM and enforces security constraints such as email format validation and uniqueness checks. Database table migrations are tailored strictly to the required users table schema. If any validation fails, the backend returns a JSON payload detailing the fields containing errors, which is then parsed dynamically by the React state engine to display visual alerts on the interface.

This decoupled architecture offers a modular foundation for learning modern web development. By separating the client interface from the database-managing server, the application achieves high performance, scalability, and ease of maintenance. It demonstrates how asynchronous state updates and RESTful web services operate together to deliver a seamless user experience, making it a perfect starting template for developers looking to understand React-Laravel integration.

---

## How to Run the Project

### 1. Start the Backend (Laravel)
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Start the Laravel server using the local PHP:
   ```bash
   ..\.local\php\php.exe artisan serve --port=8000
   ```

### 2. Start the Frontend (React)
1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```

Once both servers are running, access the portal in your browser at the URL output by the frontend terminal (typically `http://localhost:5174/`).
