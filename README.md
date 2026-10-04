# Employee Management UI

A React-based frontend for managing employee records through a Spring Boot REST API.

The application provides a simple interface to create, view, update, delete, search, and filter employees.

## Tech Stack

- React
- JavaScript
- Vite
- Material UI
- Fetch API
- ESLint

## Features

- View all employees
- Add employees
- Edit employee details
- Delete employees with confirmation
- Search employees by name, email, or role
- Form validation
- Loading states
- Success and error messages
- Responsive Material UI components

## Backend API

This frontend communicates with the Employee Management API.

Backend repository:

https://github.com/RepalaPrathyusha1998/employee-management-api

The backend runs by default at:

```text
http://localhost:8080
```
## Configuration

The API URL is configured using a Vite environment variable.

Create a .env file in the project root:

``` bash
VITE_API_URL=http://localhost:8080
```
The .env file is excluded from Git using .gitignore.

## Running the Application
### Prerequisites

Make sure the following are installed:

Node.js
npm
Employee Management API
### Install dependencies
``` bash
npm install
```
### Start the development server
``` bash
npm run dev
```
The application will be available at:
``` text
http://localhost:5173
```

## Linting
Run ESLint with:

``` bash
npm run lint
```