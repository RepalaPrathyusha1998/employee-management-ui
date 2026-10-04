import { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/employees`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch employees");
          }

          return response.json();
        })
        .then((data) => {
          setEmployees(data);
          setError("");
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
          setError("Unable to load employees. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      const url = editingId
          ? `${API_URL}/api/employees/${editingId}`
          : `${API_URL}/api/employees`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to save employee");
      }

      const savedEmployee = await response.json();
      setError("");

      if (editingId) {
        setEmployees(
            employees.map((employee) =>
                employee.id === editingId ? savedEmployee : employee
            )
        );
      } else {
        setEmployees([...employees, savedEmployee]);
      }

      setFormData({
        name: "",
        email: "",
        role: "",
      });

      setEditingId(null);
      setSuccessMessage(
          editingId
              ? "Employee updated successfully."
              : "Employee created successfully."
      );
    } catch (error) {
      console.error("Error saving employee:", error);
      setSuccessMessage("");
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
          `${API_URL}/api/employees/${id}`,
          {
            method: "DELETE",
          }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setEmployees(
          employees.filter((employee) => employee.id !== id)
      );
      setSuccessMessage("Employee deleted successfully.");
      setError("");
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleEdit = (employee) => {
    setSuccessMessage("");
    setError("");
    setEditingId(employee.id);

    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSuccessMessage("");
    setError("");

    setFormData({
      name: "",
      email: "",
      role: "",
    });
  };

  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase();

    return (
        employee.name.toLowerCase().includes(search) ||
        employee.email.toLowerCase().includes(search) ||
        employee.role.toLowerCase().includes(search)
    );
  });

  return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              Employee Management
            </Typography>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Employee Management
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
              Create, update, and manage employees.
            </Typography>

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {successMessage}
                </Alert>
            )}

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  mb: 4,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
            >
              <Typography
                  variant="h6"
                  sx={{ width: "100%" }}
              >
                {editingId ? "Edit Employee" : "Add Employee"}
              </Typography>
              <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
              />

              <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
              />

              <TextField
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
              />

              <Button
                  type="submit"
                  variant="contained"
                  sx={{ alignSelf: "center" }}
              >
                {editingId ? "Update Employee" : "Add Employee"}
              </Button>
              {editingId && (
                  <Button
                      type="button"
                      variant="outlined"
                      onClick={handleCancelEdit}
                      sx={{ alignSelf: "center" }}
                  >
                    Cancel
                  </Button>
              )}
            </Box>
            {!loading && !error && employees.length > 0 && (
                <TextField
                    label="Search employees"
                    placeholder="Search by name, email, or role"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    fullWidth
                    sx={{ mb: 3 }}
                />
            )}
            {loading ? (
                <Typography sx={{ py: 3 }}>
                  Loading employees...
                </Typography>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
            ) : employees.length === 0 ? (
                <Typography sx={{ py: 3 }}>
                  No employees found.
                </Typography>
            ) : (
                <TableContainer sx={{ overflowX: "auto" }}>
                  <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No employees match your search.
                    </TableCell>
                  </TableRow>
                  ) : (
                      filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.id}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>
                          <Button
                              variant="outlined"
                              onClick={() => handleEdit(employee)}
                              sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>

                          <Button
                              color="error"
                              onClick={() => handleDelete(employee.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                  ))
                  )}
                </TableBody>
                  </Table>
                </TableContainer>
            )}
          </Paper>
        </Container>
      </>
  );
}

export default App;