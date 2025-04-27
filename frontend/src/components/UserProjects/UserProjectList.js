import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProjects, deleteUserProject } from '../../services/api';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';

function UserProjectList() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUserProjects()
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user projects:', error);
      });
  }, []);

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteUserProject(projectId)
        .then(() => {
          setProjects(projects.filter((project) => project.id !== projectId));
        })
        .catch((error) => {
          console.error('Error deleting project:', error);
        });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Cakes for Events
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/create-user-project')}
        style={{ marginBottom: '20px' }}
      >
        Create New Project
      </Button>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{project.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {project.description}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Created on: {project.date}
                </Typography>
                <div style={{ marginTop: '10px' }}>
                  <Button
                    component={Link}
                    to={`/user-project/${project.id}`}
                    variant="outlined"
                    color="primary"
                    style={{ marginRight: '10px' }}
                  >
                    View Details
                  </Button>
                  <Button
                    component={Link}
                    to={`/user-project/${project.id}/update`}
                    variant="outlined"
                    color="secondary"
                    style={{ marginRight: '10px' }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default UserProjectList;