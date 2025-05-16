import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserProject } from '../../services/userProjectsApi';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Fade, 
  Divider, 
  CircularProgress,
  Chip,
  Avatar,
  Tooltip,
  Zoom
} from '@mui/material';
import { 
  Create, 
  Description, 
  CalendarToday, 
  Lightbulb, 
  EmojiObjects, 
  Celebration,
  FlareOutlined,
  StarOutline
} from '@mui/icons-material';

function CreateUserProject() {
  const [project, setProject] = useState({
    userId: 'user123',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [titleFocus, setTitleFocus] = useState(false);
  const [descFocus, setDescFocus] = useState(false);
  const [showInspirationTip, setShowInspirationTip] = useState(false);
  const navigate = useNavigate();
  
  // Inspiration tips that will display when the user focuses on the description field
  const inspirationTips = [
    "Try describing what makes this project unique!",
    "Think about who will benefit from this project",
    "Include any key milestones or goals",
    "What inspired you to create this project?"
  ];
  
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    // Trigger fade-in animation on component mount
    setFadeIn(true);
    
    // Rotate through inspiration tips
    if (showInspirationTip) {
      const tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % inspirationTips.length);
      }, 5000);
      
      return () => clearInterval(tipInterval);
    }
  }, [showInspirationTip]);

  const validateField = (name, value) => {
    if (name === 'title') {
      if (!value) {
        return 'Title is required';
      }
      if (value.length < 5) {
        return 'Title must be at least 5 characters';
      }
      return '';
    }
    if (name === 'description') {
      if (!value) {
        return 'Description is required';
      }
      if (value.length < 10) {
        return 'Description must be at least 10 characters';
      }
      return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const titleError = validateField('title', project.title);
    const descriptionError = validateField('description', project.description);
    
    setErrors({
      title: titleError,
      description: descriptionError,
    });

    if (titleError || descriptionError) {
      return;
    }

    //API inter
    setIsSubmitting(true);
    createUserProject(project)
      .then(() => {
        setTimeout(() => {
          navigate('/cakesforevents');
        }, 1000);
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error('Error creating project:', error);
      });
  };

  const FloatingElements = () => {
    return (
      <>
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: i % 2 === 0 ? 'primary.light' : 'secondary.light',
              opacity: 0.4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float${i} ${8 + i}s infinite ease-in-out`,
              '@keyframes float0': {
                '0%, 100%': { transform: 'translateY(0) scale(1)' },
                '50%': { transform: 'translateY(-20px) scale(1.2)' },
              },
              '@keyframes float1': {
                '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)' },
                '50%': { transform: 'translateY(-15px) translateX(10px) scale(1.1)' },
              },
              '@keyframes float2': {
                '0%, 100%': { transform: 'translateY(0) scale(1)' },
                '50%': { transform: 'translateY(20px) scale(1.3)' },
              },
              '@keyframes float3': {
                '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)' },
                '50%': { transform: 'translateY(15px) translateX(-10px) scale(1.2)' },
              },
              '@keyframes float4': {
                '0%, 100%': { transform: 'translateY(0) rotate(0) scale(1)' },
                '50%': { transform: 'translateY(-25px) rotate(45deg) scale(1.1)' },
              },
              '@keyframes float5': {
                '0%, 100%': { transform: 'translateY(0) rotate(0) scale(1)' },
                '50%': { transform: 'translateY(25px) rotate(-45deg) scale(1.3)' },
              },
            }}
          />
        ))}
      </>
    );
  };

  return (
    <Fade in={fadeIn} timeout={800}>
      <Paper elevation={5} sx={{ 
        padding: '30px', 
        maxWidth: '800px', 
        margin: '40px auto',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff, #f5f5ff 40%, #e8eaff)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(63, 81, 181, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 15px 45px rgba(0, 0, 0, 0.12), 0 0 25px rgba(63, 81, 181, 0.15)',
        }
      }}>
        {/* Decorative background elements */}
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: '200px', 
          height: '200px', 
          background: 'radial-gradient(circle at top right, rgba(63, 81, 181, 0.12), transparent 70%)',
          zIndex: 0 
        }} />
        
        <Box sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '150px', 
          height: '150px', 
          background: 'radial-gradient(circle at bottom left, rgba(103, 58, 183, 0.1), transparent 70%)',
          zIndex: 0 
        }} />
        
        {/* Animated floating elements */}
        <FloatingElements />
        
        {/* Corner decorations */}
        <Box sx={{ 
          position: 'absolute', 
          top: '5px', 
          left: '5px', 
          width: '30px', 
          height: '30px', 
          borderTop: '3px solid rgba(63, 81, 181, 0.3)',
          borderLeft: '3px solid rgba(63, 81, 181, 0.3)',
          zIndex: 0 
        }} />
        
        <Box sx={{ 
          position: 'absolute', 
          bottom: '5px', 
          right: '5px', 
          width: '30px', 
          height: '30px', 
          borderBottom: '3px solid rgba(63, 81, 181, 0.3)',
          borderRight: '3px solid rgba(63, 81, 181, 0.3)',
          zIndex: 0 
        }} />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header with enhanced styling */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '24px',
            position: 'relative'
          }}>
            <Box sx={{ 
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '60px',
              height: '60px',
              marginRight: '16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3f51b5, #7986cb)',
              boxShadow: '0 4px 10px rgba(63, 81, 181, 0.3)',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
              }
            }}>
              <Create sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            
            <Box>
              <Typography variant="h4" fontWeight="700" color="primary.dark" sx={{
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: '0',
                  width: '40%',
                  height: '3px',
                  background: 'linear-gradient(to right, #3f51b5, transparent)',
                }
              }}>
                Create New Project
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginTop: '4px' }}>
                Bring your vision to life by designing a new project
              </Typography>
            </Box>
            
            <Zoom in={true} style={{ transitionDelay: '500ms' }}>
              <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
                <Tooltip title="Let your creativity shine!">
                  <Chip
                    icon={<FlareOutlined fontSize="small" />}
                    label="New Creation"
                    color="secondary"
                    variant="outlined"
                    size="small"
                    sx={{ 
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { boxShadow: '0 0 0 rgba(103, 58, 183, 0)' },
                        '50%': { boxShadow: '0 0 8px rgba(103, 58, 183, 0.5)' },
                      }
                    }}
                  />
                </Tooltip>
              </Box>
            </Zoom>
          </Box>
          
          <Divider sx={{ 
            marginBottom: '24px',
            '&::before, &::after': {
              borderColor: 'primary.light',
            },
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '40px',
              height: '3px',
              background: 'linear-gradient(to right, #3f51b5, transparent)',
              top: '-1.5px',
              left: '0',
            }
          }} />
          
          <form onSubmit={handleSubmit}>
            {/* Enhanced Title Field */}
            <Box sx={{ position: 'relative' }}>
              <TextField
                label="Project Title"
                name="title"
                value={project.title}
                onChange={handleChange}
                onFocus={() => setTitleFocus(true)}
                onBlur={() => setTitleFocus(false)}
                fullWidth
                margin="normal"
                required
                error={!!errors.title}
                helperText={errors.title}
                InputProps={{
                  startAdornment: <Description color="action" sx={{ marginRight: '8px' }} />,
                }}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '8px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  transform: titleFocus ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: titleFocus ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              />
              {titleFocus && project.title.length >= 3 && (
                <Zoom in={true}>
                  <Box sx={{ position: 'absolute', right: '10px', top: '30px' }}>
                    <StarOutline sx={{ color: 'primary.main', animation: 'spin 4s linear infinite', '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }}} />
                  </Box>
                </Zoom>
              )}
            </Box>
            
            {/* Enhanced Description Field */}
            <Box sx={{ position: 'relative', marginTop: '16px' }}>
              <TextField
                label="Project Description"
                name="description"
                value={project.description}
                onChange={handleChange}
                onFocus={() => {
                  setDescFocus(true);
                  setShowInspirationTip(true);
                }}
                onBlur={() => {
                  setDescFocus(false);
                  setShowInspirationTip(false);
                }}
                fullWidth
                multiline
                rows={4}
                required
                error={!!errors.description}
                helperText={errors.description}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '8px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  transform: descFocus ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: descFocus ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
              
              {/* Inspiration Tip Animation */}
              {showInspirationTip && (
                <Fade in={showInspirationTip} timeout={500}>
                  <Box sx={{ 
                    position: 'absolute', 
                    right: '20px', 
                    bottom: '-50px',
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '300px'
                  }}>
                    <Lightbulb color="warning" sx={{ marginRight: '8px', animation: 'glow 2s infinite alternate', '@keyframes glow': {
                      '0%': { filter: 'drop-shadow(0 0 1px rgba(255, 167, 38, 0.5))' },
                      '100%': { filter: 'drop-shadow(0 0 5px rgba(255, 167, 38, 0.8))' }
                    }}} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      {inspirationTips[currentTip]}
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Box>
            
            {/* Enhanced Date Display */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginTop: '20px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(240, 240, 250, 0.8)',
              border: '1px dashed rgba(63, 81, 181, 0.3)',
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(63, 81, 181, 0.15)',
                marginRight: '12px'
              }}>
                <CalendarToday color="primary" fontSize="small" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Creation Date: <strong>{project.date}</strong>
              </Typography>
            </Box>
            
            {/* Project Creation Tips */}
            <Zoom in={true} style={{ transitionDelay: '300ms' }}>
              <Box sx={{ 
                marginTop: '24px',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(103, 58, 183, 0.05)',
                border: '1px solid rgba(103, 58, 183, 0.1)',
                display: 'flex',
                alignItems: 'flex-start'
              }}>
                <EmojiObjects color="secondary" sx={{ marginRight: '12px', marginTop: '2px' }} />
                <Box>
                  <Typography variant="subtitle2" color="secondary.dark" fontWeight="600">
                    Project Creation Tips
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Make your project stand out with a clear title and comprehensive description. 
                    Great projects have specific goals and well-defined outcomes.
                  </Typography>
                </Box>
              </Box>
            </Zoom>
            
            {/* Enhanced Button Section */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              marginTop: '30px',
              position: 'relative'
            }}>
              <Button 
                type="button" 
                variant="outlined"
                sx={{ 
                  marginRight: '16px',
                  borderRadius: '8px',
                  paddingX: '20px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }
                }}
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
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(45deg, #3f51b5, #5c6bc0)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #3949ab, #5c6bc0)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(63, 81, 181, 0.4)'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.7s',
                  },
                  '&:hover::after': {
                    left: '100%',
                  }
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    Create Project
                    <Celebration sx={{ marginLeft: '8px', fontSize: '18px', animation: isSubmitting ? 'celebrate 1s infinite' : 'none', '@keyframes celebrate': {
                      '0%, 100%': { transform: 'rotate(0deg)' },
                      '25%': { transform: 'rotate(15deg)' },
                      '75%': { transform: 'rotate(-15deg)' },
                    }}} />
                  </>
                )}
              </Button>
              
              {/* Success animation for form submission */}
              {isSubmitting && (
                <Box sx={{
                  position: 'absolute',
                  top: '-50px',
                  right: '20px',
                  animation: 'flyUp 1s forwards',
                  '@keyframes flyUp': {
                    '0%': { transform: 'translateY(0)', opacity: 1 },
                    '100%': { transform: 'translateY(-50px)', opacity: 0 },
                  }
                }}>
                  <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Celebration color="success" sx={{ marginRight: '4px', fontSize: '14px' }} />
                    Creating your project!
                  </Typography>
                </Box>
              )}
            </Box>
          </form>
        </Box>
      </Paper>
    </Fade>
  );
}

export default CreateUserProject;