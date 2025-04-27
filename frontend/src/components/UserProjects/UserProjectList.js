import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProjects, deleteUserProject } from '../../services/api';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Paper, 
  Fade, 
  Grow, 
  Chip, 
  Divider, 
  IconButton, 
  Tooltip, 
  CircularProgress,
  CardActions,
  CardHeader,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Edit, 
  Visibility, 
  MoreVert, 
  Event, 
  Cake, 
  SortRounded, 
  SearchRounded,
  NoPhotography
} from '@mui/icons-material';

function UserProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getUserProjects()
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
        // Start fade-in animation after data is loaded
        setTimeout(() => setFadeIn(true), 100);
      })
      .catch((error) => {
        console.error('Error fetching user projects:', error);
        setLoading(false);
      });
  }, []);

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedProject) {
      deleteUserProject(selectedProject.id)
        .then(() => {
          setProjects(projects.filter((project) => project.id !== selectedProject.id));
          setDeleteDialogOpen(false);
          setSelectedProject(null);
        })
        .catch((error) => {
          console.error('Error deleting project:', error);
          setDeleteDialogOpen(false);
        });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedProject(null);
  };

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
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

  const getProjectInitial = (title) => {
    return title ? title.charAt(0).toUpperCase() : 'P';
  };

  const getRandomColor = (id) => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50'];
    // Use project id to generate a consistent color
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getProgressCount = (project) => {
    return project.progressUpdates ? project.progressUpdates.length : 0;
  };

  const renderSkeletons = () => {
    return Array(6).fill().map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
        <Card sx={{ height: '100%', borderRadius: '12px' }}>
          <CardHeader
            avatar={<Skeleton variant="circular" width={40} height={40} />}
            title={<Skeleton variant="text" width="80%" />}
            subheader={<Skeleton variant="text" width="40%" />}
          />
          <CardContent>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
          </CardContent>
          <CardActions>
            <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: '4px', mr: 1 }} />
            <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: '4px' }} />
          </CardActions>
        </Card>
      </Grid>
    ));
  };

  return (
    <Fade in={fadeIn || !loading} timeout={800}>
      <Paper 
        elevation={0} 
        sx={{ 
          padding: '30px', 
          borderRadius: '0',
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #f5f7fa, #eef1f5)'
        }}
      >
        <Box 
          sx={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            position: 'relative'
          }}
        >
          {/* Decorative elements */}
          <Box sx={{ 
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(63, 81, 181, 0.05), transparent 70%)',
            zIndex: 0
          }} />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Header Section */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Cake color="primary" sx={{ fontSize: 36, mr: 2 }} />
                <Typography 
                  variant="h4" 
                  fontWeight="600"
                  color="primary.main"
                  sx={{ 
                    textShadow: '1px 1px 1px rgba(0,0,0,0.05)',
                    letterSpacing: '0.5px'
                  }}
                >
                  Cakes for Events
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => navigate('/create-user-project')}
                sx={{ 
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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
                Create New Project
              </Button>
            </Box>
            
            {/* Filter toolbar */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  icon={<SearchRounded />} 
                  label={`${projects.length} Project${projects.length !== 1 ? 's' : ''}`} 
                  variant="outlined" 
                  color="primary"
                />
              </Box>
              
              <Box>
                <Button 
                  startIcon={<SortRounded />} 
                  variant="outlined" 
                  size="small"
                  onClick={handleSortMenuOpen}
                >
                  Sort Projects
                </Button>
                <Menu
                  anchorEl={sortAnchorEl}
                  open={Boolean(sortAnchorEl)}
                  onClose={handleSortMenuClose}
                >
                  <MenuItem onClick={handleSortMenuClose}>Newest First</MenuItem>
                  <MenuItem onClick={handleSortMenuClose}>Oldest First</MenuItem>
                  <MenuItem onClick={handleSortMenuClose}>Alphabetical (A-Z)</MenuItem>
                </Menu>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 4 }} />
            
            {/* Project Grid */}
            <Grid container spacing={3}>
              {loading ? renderSkeletons() : (
                projects.length > 0 ? (
                  projects.map((project, index) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                      <Grow 
                        in={fadeIn}
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={(index + 1) * 200}
                      >
                        <Card 
                          sx={{ 
                            height: '100%',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                            },
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Decorative top border */}
                          <Box sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: getRandomColor(project.id)
                          }} />
                          
                          <CardHeader
                            avatar={
                              <Avatar 
                                sx={{ 
                                  bgcolor: getRandomColor(project.id),
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                              >
                                {getProjectInitial(project.title)}
                              </Avatar>
                            }
                            action={
                              <IconButton 
                                aria-label="project settings"
                                onClick={(e) => handleMenuOpen(e, project)}
                              >
                                <MoreVert />
                              </IconButton>
                            }
                            title={
                              <Typography 
                                variant="h6" 
                                fontWeight="500"
                                noWrap
                                sx={{ 
                                  maxWidth: '200px',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden'
                                }}
                              >
                                {project.title}
                              </Typography>
                            }
                            subheader={
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Event fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.875rem' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(project.date)}
                                </Typography>
                              </Box>
                            }
                          />
                          <CardContent sx={{ pb: 0 }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                mb: 1,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                height: '3.6em',
                                lineHeight: '1.2em'
                              }}
                            >
                              {project.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', mt: 2 }}>
                              <Chip 
                                label={`${getProgressCount(project)} updates`} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            </Box>
                          </CardContent>
                          <CardActions sx={{ padding: 2, pt: 1, justifyContent: 'flex-end' }}>
                            <Button
                              component={Link}
                              to={`/user-project/${project.id}`}
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<Visibility />}
                              sx={{ mr: 1 }}
                            >
                              View
                            </Button>
                            <Button
                              component={Link}
                              to={`/user-project/${project.id}/update`}
                              variant="outlined"
                              color="secondary"
                              size="small"
                              startIcon={<Edit />}
                            >
                              Edit
                            </Button>
                          </CardActions>
                        </Card>
                      </Grow>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 8,
                        px: 3,
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        border: '1px dashed rgba(0, 0, 0, 0.12)'
                      }}
                    >
                      <NoPhotography sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No projects found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Create your first project by clicking the button above
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => navigate('/create-user-project')}
                      >
                        Create New Project
                      </Button>
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          </Box>
        </Box>
        
        {/* Project Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem 
            component={Link} 
            to={selectedProject ? `/user-project/${selectedProject.id}` : '#'}
            onClick={handleMenuClose}
          >
            <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
          </MenuItem>
          <MenuItem 
            component={Link} 
            to={selectedProject ? `/user-project/${selectedProject.id}/update` : '#'}
            onClick={handleMenuClose}
          >
            <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Project
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => {
              handleMenuClose();
              if (selectedProject) handleDeleteClick(selectedProject);
            }}
            sx={{ color: 'error.main' }}
          >
            <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Project
          </MenuItem>
        </Menu>
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: { borderRadius: '12px', padding: '10px' }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Delete color="error" sx={{ mr: 1 }} />
              Confirm Deletion
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the project "<strong>{selectedProject?.title}</strong>"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ pb: 2, px: 3 }}>
            <Button onClick={handleDeleteCancel} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Fade>
  );
}

export default UserProjectList;