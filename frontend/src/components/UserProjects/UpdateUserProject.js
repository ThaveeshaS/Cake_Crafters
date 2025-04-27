import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProjectById, updateUserProject } from '../../services/api';
import { TextField, Button, Typography, Box } from '@mui/material';

function UpdateUserProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserProjectById(id)
      .then((response) => {
        setProject(response.data);
      })
      .catch((error) => {
        console.error('Error fetching project:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProject(id, project)
      .then(() => {
        navigate(`/user-project/${id}`);
      })
      .catch((error) => {
        console.error('Error updating project:', error);
      });
  };

  if (!project) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Update Project
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
          Update Project
        </Button>
      </form>
    </Box>
  );
}

export default UpdateUserProject;