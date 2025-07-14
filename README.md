# To-Do List Web Application with Supabase and React

## Overview
This project is a simple, responsive To-Do List web application with full user authentication and task management features.

### Features
- User Authentication (Signup, Login) with secure password hashing using Supabase Auth.
- Task management: Add, edit, delete, mark complete tasks.
- Each user manages their own tasks.
- Responsive UI built with React and Tailwind CSS.
- Bonus features: Due dates, sorting, drag-and-drop task reordering, dynamic UI updates.
- Backend and database powered by Supabase (PostgreSQL).

## Project Structure
- `src/`
  - `components/` - React components (Auth, TaskList, TaskItem, etc.)
  - `pages/` - React pages (Login, Signup, Dashboard)
  - `App.js` - Main React app component with routing
  - `supabaseClient.js` - Supabase client setup
- `public/` - Static assets
- `package.json` - Project dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration

## Technologies
- React
- Tailwind CSS
- Supabase (Auth, Database)
- React Router for navigation
- React DnD or similar for drag-and-drop

## Development
- Run `npm install` to install dependencies.
- Run `npm start` to start the development server.
- Configure Supabase project and update `supabaseClient.js` with your credentials.

## Next Steps
- Implement authentication pages (Signup, Login).
- Implement protected dashboard with task management.
- Add bonus features: due dates, sorting, drag-and-drop.
- Test responsiveness and accessibility.
