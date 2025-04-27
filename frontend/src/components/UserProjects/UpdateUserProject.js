import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProjectById, updateUserProject } from '../../services/api';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Fade, 
  CircularProgress, 
  Backdrop,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  Edit, 
  Description, 
  Save, 
  ArrowBack, 
  AccessTime,
  MoreVert
} from '@mui/icons-material';

function UpdateUserProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [lastEdited, setLastEdited] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getUserProjectById(id)
      .then((response) => {
        setProject(response.data);
        setLoading(false);
        // Start fade-in animation after data is loaded
        setTimeout(() => setFadeIn(true), 100);
      })
      .catch((error) => {
        console.error('Error fetching project:', error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
    setLastEdited(new Date());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    updateUserProject(id, project)
      .then(() => {
        // Add slight delay for visual feedback
        setTimeout(() => {
          navigate(`/user-project/${id}`);
        }, 800);
      })
      .catch((error) => {
        console.error('Error updating project:', error);
        setSaving(false);
      });
  };

  const handleCancel = () => {
    navigate(`/user-project/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '70vh',
        flexDirection: 'column'
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading project details...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={fadeIn} timeout={800}>
      <Box sx={{ 
        padding: '20px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <Paper 
          elevation={4} 
          sx={{ 
            padding: '30px',
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f7ff 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative corner elements */}
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '150px', 
            height: '150px', 
            background: 'radial-gradient(circle at top right, rgba(25, 118, 210, 0.08), transparent 70%)',
            zIndex: 0 
          }} />
          
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            width: '120px', 
            height: '120px', 
            background: 'radial-gradient(circle at bottom left, rgba(25, 118, 210, 0.05), transparent 70%)',
            zIndex: 0 
          }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Edit color="primary" sx={{ fontSize: 32, mr: 2 }} />
                <Typography variant="h4" fontWeight="600" color="primary.main">
                  Update Project
                </Typography>
              </Box>
              <Chip 
                label={`Project ID: ${id.substring(0, 8)}...`} 
                size="small" 
                variant="outlined" 
                icon={<MoreVert fontSize="small" />}
              />
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
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
                  startAdornment: <Description color="action" sx={{ mr: 1 }} />,
                }}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              
              <TextField
                label="Description"
                name="description"
                value={project.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={5}
                required
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '8px',
                  my: 3,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mt: 2, 
                mb: 3 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Last edited: {lastEdited.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Tooltip title="Return to project details">
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Tooltip>
                
                <Tooltip title="Save changes">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    disabled={saving}
                    sx={{ 
                      minWidth: '150px',
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
                        transition: 'left 0.7s',
                      },
                      '&:hover::after': {
                        left: '100%',
                      }
                    }}
                  >
                    {saving ? 'Saving...' : 'Update Project'}
                  </Button>
                </Tooltip>
              </Box>
            </form>
          </Box>
        </Paper>
        
        {/* Saving indicator backdrop */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={saving}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '20px 40px',
            borderRadius: '12px'
          }}>
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }}>Saving your changes...</Typography>
          </Box>
        </Backdrop>
      </Box>
    </Fade>
  );
}

export default UpdateUserProject;