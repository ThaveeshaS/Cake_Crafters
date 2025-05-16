import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProjectById, addProgressUpdate } from '../../services/userProjectsApi';
import { 
  Typography, 
  Button, 
  TextField, 
  Box, 
  List, 
  ListItem, 
  IconButton, 
  Paper, 
  Divider, 
  Chip, 
  Card, 
  CardContent, 
  CardMedia, 
  Fade, 
  Grow, 
  Skeleton, 
  Avatar,
  Grid,
  Tooltip,
  Badge,
  Fab,
  Zoom
} from '@mui/material';
import { 
  PhotoCamera, 
  Event, 
  ArrowBack, 
  History, 
  Add, 
  DeleteOutline,
  Image as ImageIcon,
  TextFormat,
  Cancel,
  Timeline,
  UpdateOutlined,
  FiberManualRecord
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Keyframe animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(63, 81, 181, 0); }
  100% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0); }
`;

// Styled components
const DecoratedPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
  padding: '40px',
  background: 'linear-gradient(145deg, #ffffff, #f6f9ff)',
  position: 'relative',
  overflow: 'hidden',
  border: '2px solid transparent',
  backgroundClip: 'padding-box',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  '&:before': {
    content: '""',
    position: 'absolute',
    inset: '-2px',
    background: 'linear-gradient(45deg, #3f51b5, #ff4081)',
    zIndex: -1,
    borderRadius: '22px'
  }
}));

const AnimatedCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
  }
}));

const FloatingFab = styled(Fab)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
  '&:hover': {
    animation: `${pulse} 2s infinite`
  }
}));

function UserProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [progressUpdate, setProgressUpdate] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = window.scrollY;
        containerRef.current.style.backgroundPositionY = `${scrollPosition * 0.3}px`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    getUserProjectById(id)
      .then((response) => {
        setProject(response.data);
        setLoading(false);
        setTimeout(() => setFadeIn(true), 100);
      })
      .catch((error) => {
        console.error('Error fetching project:', error);
        setLoading(false);
      });
  }, [id]);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Please upload a file smaller than 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile(reader.result);
        setMediaPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleAddProgressUpdate = () => {
    let updateContent = progressUpdate.trim();
    if (mediaFile) {
      updateContent = mediaFile;
    } else if (!updateContent) {
      return;
    }

    addProgressUpdate(id, updateContent)
      .then((response) => {
        setProject(response.data);
        setProgressUpdate('');
        setMediaFile(null);
        setMediaPreview(null);
      })
      .catch((error) => {
        console.error('Error adding progress update:', error);
      });
  };

  const isImage = (update) => {
    return typeof update === 'string' && update.startsWith('data:image/');
  };

  const cleanUpdate = (update) => {
    if (update == null) return '';
    if (Array.isArray(update)) {
      return cleanUpdate(update[0]);
    }
    let cleaned = String(update);
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }
    if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
      try {
        const parsed = JSON.parse(cleaned);
        return cleanUpdate(parsed);
      } catch (e) {
        return cleaned;
      }
    }
    if (cleaned.startsWith('update:"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(8, -1);
    }
    return cleaned;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <Skeleton variant="text" height={60} width="50%" />
        <Skeleton variant="text" height={100} />
        <Skeleton variant="text" height={30} width="30%" sx={{ mt: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 4 }} />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ 
        padding: '40px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography variant="h5" color="error">
          Project not found or error loading project
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/cakesforevents')}
          sx={{ mt: 3 }}
        >
          Return to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Fade in={fadeIn} timeout={1000}>
      <Box sx={{ 
        padding: '40px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* SVG Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          zIndex: -1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233f51b5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30v4h-4v2h4v4h2v-4h4v-2h-4V0h-2zM6 34v4H2v2h4v4h2v-4h4v-2H8v-4H6zm0-30v4H2v2h4v4h2V6h4V4H8V0H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px'
        }} />

        <DecoratedPaper elevation={6} ref={containerRef}>
          {/* Animated Particles */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 0,
            '& > div': {
              position: 'absolute',
              borderRadius: '50%',
              background: 'rgba(63, 81, 181, 0.2)',
              animation: `${float} 6s ease-in-out infinite`
            }
          }}>
            <div style={{ width: '20px', height: '20px', top: '10%', left: '15%', animationDelay: '0s' }} />
            <div style={{ width: '15px', height: '15px', top: '60%', left: '80%', animationDelay: '2s' }} />
            <div style={{ width: '25px', height: '25px', top: '80%', left: '30%', animationDelay: '4s' }} />
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Project Header */}
            <Box sx={{ mb: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography 
                  variant="h3" 
                  fontWeight="700" 
                  color="primary.main"
                  sx={{ 
                    mb: 1,
                    fontFamily: '"Playfair Display", serif',
                    background: 'linear-gradient(45deg, #3f51b5, #ff4081)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {project.title}
                </Typography>
                <Chip 
                  label={`Project #${id.substring(0, 6)}`} 
                  color="primary" 
                  variant="outlined" 
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    fontWeight: '600',
                    background: 'rgba(63, 81, 181, 0.1)'
                  }}
                />
              </Box>
              
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  mt: 2, 
                  fontSize: '1.15rem',
                  lineHeight: 1.8,
                  color: 'text.primary',
                  fontFamily: '"Roboto", sans-serif'
                }}
              >
                {project.description}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 1,
                color: 'text.secondary'
              }}>
                <Event fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  Created on: {formatDate(project.date)}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ 
              my: 4,
              background: 'linear-gradient(to right, transparent, #3f51b5, transparent)'
            }} />
            
            {/* Progress Updates Section */}
            <Box sx={{ mb: 5 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3 
              }}>
                <Timeline color="primary" sx={{ mr: 1 }} />
                <Typography 
                  variant="h4" 
                  color="primary.main"
                  fontWeight="600"
                  sx={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Progress Updates
                </Typography>
                <Badge 
                  badgeContent={project.progressUpdates?.length || 0} 
                  color="primary"
                  sx={{ ml: 2 }}
                >
                  <UpdateOutlined fontSize="small" />
                </Badge>
              </Box>
              
              {project.progressUpdates && project.progressUpdates.length > 0 ? (
                <List sx={{ pt: 1 }}>
                  {project.progressUpdates.map((update, index) => {
                    const cleanedUpdate = cleanUpdate(update);
                    const isImg = isImage(cleanedUpdate);
                    
                    return (
                      <Grow 
                        in={true} 
                        key={index}
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={(index + 1) * 300}
                      >
                        <ListItem sx={{ display: 'block', py: 1 }}>
                          <AnimatedCard>
                            <CardContent sx={{ pb: isImg ? 0 : 2 }}>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                mb: isImg ? 2 : 0
                              }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <FiberManualRecord 
                                    sx={{ 
                                      mr: 1, 
                                      color: isImg ? 'secondary.main' : 'primary.main',
                                      fontSize: '16px',
                                      transition: 'transform 0.3s',
                                      '&:hover': { transform: 'scale(1.3)' }
                                    }} 
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    Update #{project.progressUpdates.length - index}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date().toLocaleDateString()}
                                </Typography>
                              </Box>
                              
                              {isImg ? (
                                <CardMedia
                                  component="img"
                                  image={cleanedUpdate}
                                  alt="Progress update"
                                  sx={{ 
                                    maxHeight: '450px',
                                    objectFit: 'contain',
                                    borderBottomLeftRadius: '16px',
                                    borderBottomRightRadius: '16px',
                                    transition: 'opacity 0.3s',
                                    '&:hover': { opacity: 0.95 }
                                  }}
                                />
                              ) : (
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    mt: 1.5,
                                    fontSize: '1rem',
                                    lineHeight: 1.8,
                                    fontFamily: '"Roboto", sans-serif'
                                  }}
                                >
                                  {cleanedUpdate}
                                </Typography>
                              )}
                            </CardContent>
                          </AnimatedCard>
                        </ListItem>
                      </Grow>
                    );
                  })}
                </List>
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    py: 5,
                    px: 2,
                    background: 'linear-gradient(145deg, #f6f9ff, #ffffff)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(63, 81, 181, 0.3)'
                  }}
                >
                  <History color="action" fontSize="large" sx={{ mb: 1 }} />
                  <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No progress updates yet. Add your first update below.
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Add Progress Update Section */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                borderRadius: '16px',
                background: 'rgba(245, 247, 250, 0.9)',
                mb: 4,
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(to right, #3f51b5, #ff4081)'
                }
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontFamily: '"Playfair Display", serif'
                }}
              >
                <Add fontSize="small" sx={{ mr: 1 }} />
                Add New Update
              </Typography>
              
              <TextField
                label="Add Progress Update (Text)"
                value={progressUpdate}
                onChange={(e) => setProgressUpdate(e.target.value)}
                fullWidth
                margin="normal"
                disabled={!!mediaFile}
                variant="outlined"
                multiline
                rows={4}
                sx={{ 
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#3f51b5'
                    }
                  }
                }}
              />
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 2, mb: 1 }}
              >
                Or upload an image:
              </Typography>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="upload-media"
                      type="file"
                      onChange={handleMediaChange}
                    />
                    <label htmlFor="upload-media">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCamera />}
                        sx={{ 
                          mr: 2,
                          borderRadius: '20px',
                          borderColor: '#3f51b5',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #3f51b5, #ff4081)',
                            color: 'white'
                          }
                        }}
                      >
                        Select Image
                      </Button>
                    </label>
                    {mediaFile && (
                      <Tooltip title="Remove image">
                        <IconButton 
                          color="error" 
                          onClick={handleClearMedia}
                          size="small"
                        >
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Max file size: 5 MB
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  {mediaPreview && (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end' 
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        Preview:
                      </Typography>
                      <Avatar 
                        src={mediaPreview} 
                        variant="rounded" 
                        sx={{ 
                          width: 80, 
                          height: 80,
                          border: '2px solid #3f51b5',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
              
              <Zoom in={progressUpdate.trim() || mediaFile}>
                <FloatingFab
                  color="primary"
                  onClick={handleAddProgressUpdate}
                  sx={{ 
                    position: 'absolute',
                    bottom: 24,
                    right: 24
                  }}
                >
                  <Add />
                </FloatingFab>
              </Zoom>
            </Paper>
            
            {/* Navigation Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 5 
            }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/cakesforevents')}
                sx={{
                  borderRadius: '20px',
                  px: 4,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #3f51b5, #ff4081)',
                    color: 'white'
                  }
                }}
              >
                Back to Projects
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(`/update-project/${id}`)}
                startIcon={<UpdateOutlined />}
                sx={{
                  borderRadius: '20px',
                  px: 4,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ff4081, #3f51b5)',
                    color: 'white'
                  }
                }}
              >
                Edit Project
              </Button>
            </Box>
          </Box>
        </DecoratedPaper>
      </Box>
    </Fade>
  );
}

export default UserProjectDetails;