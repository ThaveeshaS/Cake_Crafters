import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProjectById, addProgressUpdate } from '../../services/api';
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
  Badge
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
  UpdateOutlined
} from '@mui/icons-material';

function UserProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [progressUpdate, setProgressUpdate] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
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

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5 MB to avoid database issues)
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Please upload a file smaller than 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile(reader.result); // Save the Base64 string
        setMediaPreview(URL.createObjectURL(file)); // Create preview URL
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
      updateContent = mediaFile; // Use the Base64 string if an image is selected
    } else if (!updateContent) {
      return; // No update to add
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
    // Ensure the update is a string and check if it starts with 'data:image/'
    return typeof update === 'string' && update.startsWith('data:image/');
  };

  const cleanUpdate = (update) => {
    // Handle various malformed data formats
    if (update == null) return '';
    
    // If the update is an array, take the first element
    if (Array.isArray(update)) {
      return cleanUpdate(update[0]);
    }

    // Convert to string if it's not already
    let cleaned = String(update);

    // Remove extra quotes if present (e.g., '"data:image/png;base64,..."')
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }

    // Remove array brackets if present (e.g., '["data:image/png;base64,..."]')
    if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
      try {
        const parsed = JSON.parse(cleaned);
        return cleanUpdate(parsed);
      } catch (e) {
        return cleaned;
      }
    }

    // Remove any 'update:' prefix if present (e.g., 'update:"data:image/png;base64,..."')
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
      <Box sx={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
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
    <Fade in={fadeIn} timeout={800}>
      <Box sx={{ 
        padding: '30px', 
        maxWidth: '1000px', 
        margin: '0 auto'
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: '16px',
            padding: '30px',
            background: 'linear-gradient(to right bottom, #ffffff, #f8f9ff)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative elements */}
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '200px', 
            height: '200px', 
            background: 'radial-gradient(circle at top right, rgba(63, 81, 181, 0.08), transparent 70%)',
            zIndex: 0 
          }} />
          
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            width: '180px', 
            height: '180px', 
            background: 'radial-gradient(circle at bottom left, rgba(63, 81, 181, 0.05), transparent 70%)',
            zIndex: 0 
          }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Project Header */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography 
                  variant="h4" 
                  fontWeight="600" 
                  color="primary.main"
                  sx={{ mb: 1 }}
                >
                  {project.title}
                </Typography>
                <Chip 
                  label={`Project #${id.substring(0, 6)}`} 
                  color="primary" 
                  variant="outlined" 
                  size="small"
                />
              </Box>
              
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  mt: 2, 
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: 'text.primary' 
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
                <Typography variant="body2">
                  Created on: {formatDate(project.date)}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Progress Updates Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2 
              }}>
                <Timeline color="primary" sx={{ mr: 1 }} />
                <Typography 
                  variant="h5" 
                  color="primary.main"
                  fontWeight="500"
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
                        timeout={(index + 1) * 200}
                      >
                        <Card 
                          sx={{ 
                            mb: 2, 
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                          }}
                        >
                          <CardContent sx={{ pb: isImg ? 0 : 2 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              mb: isImg ? 2 : 0
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  sx={{ 
                                    width: 24, 
                                    height: 24,
                                    mr: 1,
                                    bgcolor: isImg ? 'secondary.light' : 'primary.light'
                                  }}
                                >
                                  {isImg ? <ImageIcon fontSize="small" /> : <TextFormat fontSize="small" />}
                                </Avatar>
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
                                  maxHeight: '400px',
                                  objectFit: 'contain',
                                  borderBottomLeftRadius: '12px',
                                  borderBottomRightRadius: '12px'
                                }}
                              />
                            ) : (
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  mt: 1.5,
                                  fontSize: '1rem',
                                  lineHeight: 1.6
                                }}
                              >
                                {cleanedUpdate}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
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
                    py: 4,
                    px: 2,
                    backgroundColor: 'background.paper',
                    borderRadius: '8px',
                    border: '1px dashed rgba(0, 0, 0, 0.12)'
                  }}
                >
                  <History color="action" fontSize="large" sx={{ mb: 1 }} />
                  <Typography color="text.secondary">
                    No progress updates yet. Add your first update below.
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Add Progress Update Section */}
            <Paper 
              elevation={1} 
              sx={{ 
                p: 3, 
                borderRadius: '12px',
                background: 'rgba(245, 247, 250, 0.7)',
                mb: 3
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
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
                rows={3}
                sx={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px'
                }}
              />
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 2, mb: 1 }}
              >
                Or upload an image:
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
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
                        sx={{ mr: 2 }}
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
                        sx={{ width: 60, height: 60 }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddProgressUpdate}
                disabled={!progressUpdate.trim() && !mediaFile}
                sx={{ 
                  mt: 3,
                  px: 3,
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
                startIcon={<Add />}
              >
                Post Update
              </Button>
            </Paper>
            
            {/* Navigation Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 4 
            }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/cakesforevents')}
              >
                Back to Projects
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(`/update-project/${id}`)}
                startIcon={<UpdateOutlined />}
              >
                Edit Project
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}

export default UserProjectDetails;