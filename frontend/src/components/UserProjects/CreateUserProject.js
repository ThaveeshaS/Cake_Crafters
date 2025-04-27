import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserProject } from '../../services/api';
import { TextField, Button, Typography, Box, Paper, Fade, Divider, CircularProgress } from '@mui/material';
import { Create, Description, CalendarToday } from '@mui/icons-material';

function CreateUserProject() {
  const [project, setProject] = useState({
    userId: 'user123',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger fade-in animation on component mount
    setFadeIn(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    createUserProject(project)
      .then(() => {
        navigate('/cakesforevents');
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error('Error creating project:', error);
      });
  };

  return (
    <Fade in={fadeIn} timeout={800}>
      <Paper elevation={3} sx={{ 
        padding: '30px', 
        maxWidth: '800px', 
        margin: '40px auto',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to right bottom, #ffffff, #f9f9ff)'
      }}>
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: '150px', 
          height: '150px', 
          background: 'radial-gradient(circle at top right, rgba(63, 81, 181, 0.1), transparent 70%)',
          zIndex: 0 
        }} />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Create color="primary" sx={{ fontSize: 32, marginRight: '12px' }} />
            <Typography variant="h4" fontWeight="600" color="primary.main">
              Create New Project
            </Typography>
          </Box>
          
          <Divider sx={{ marginBottom: '20px' }} />
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              value={project.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: <Description color="action" sx={{ marginRight: '8px' }} />,
              }}
              sx={{ background: 'rgba(255, 255, 255, 0.8)' }}
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
              sx={{ background: 'rgba(255, 255, 255, 0.8)' }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <CalendarToday color="action" sx={{ marginRight: '8px' }} />
              <Typography variant="body2" color="text.secondary">
                Creation Date: {project.date}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
              <Button 
                type="button" 
                variant="outlined"
                sx={{ marginRight: '16px' }}
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ 
                  paddingX: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover::after': {
                    left: '100%',
                  }
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Project'
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Fade>
  );
}

export default CreateUserProject;