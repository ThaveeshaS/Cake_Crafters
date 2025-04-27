import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserProject } from '../../services/api';
import { TextField, Button, Typography, Box } from '@mui/material';

function CreateUserProject() {
  const [project, setProject] = useState({
    userId: 'user123',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserProject(project)
      .then(() => {
        navigate('/cakesforevents');
      })
      .catch((error) => {
        console.error('Error creating project:', error);
      });
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Create New Project
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={project.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={project.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
        >
          Create Project
        </Button>
      </form>
    </Box>
  );
}

export default CreateUserProject;