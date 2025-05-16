import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProjects, deleteUserProject } from '../../services/userProjectsApi';
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
  Skeleton,
  TextField,
  InputAdornment
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
  NoPhotography,
  Clear
} from '@mui/icons-material';

function UserProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getUserProjects()
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
        setTimeout(() => setFadeIn(true), 100);
      })
      .catch((error) => {
        console.error('Error fetching user projects:', error);
        setLoading(false);
      });
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
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
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceff', '#ff9f43', '#6ab04c', '#eb4d4b', '#7f8c8d'];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getProgressCount = (project) => {
    return project.progressUpdates ? project.progressUpdates.length : 0;
  };

  const renderSkeletons = () => {
    return Array(6).fill().map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
        <Card sx={{ height: '100%', borderRadius: '16px', background: 'rgba(255,255,255,0.9)' }}>
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
            <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: '8px', mr: 1 }} />
            <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: '8px' }} />
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
          padding: { xs: '20px', md: '40px' }, 
          borderRadius: '0',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Particles */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: 'rgba(100, 149, 237, 0.3)',
            borderRadius: '50%',
            top: '20%',
            left: '10%',
            animation: 'float 6s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: 'rgba(255, 182, 193, 0.3)',
            borderRadius: '50%',
            top: '60%',
            right: '15%',
            animation: 'float 8s ease-in-out infinite reverse',
          },
          '@keyframes float': {
            '0%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(20px, -30px)' },
            '100%': { transform: 'translate(0, 0)' },
          }
        }} />
        
        <Box 
          sx={{ 
            maxWidth: '1400px', 
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Decorative Background Elements */}
          <Box sx={{ 
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(100, 149, 237, 0.08), transparent 70%)',
            zIndex: 0
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(255, 182, 193, 0.08), transparent 70%)',
            zIndex: 0
          }} />

          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 5,
            flexWrap: 'wrap',
            gap: 2,
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Cake sx={{ fontSize: 40, mr: 2, color: '#6495ED', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
              <Typography 
                variant="h3" 
                fontWeight="700"
                sx={{ 
                  color: '#2D3748',
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(to right, #2D3748, #6495ED)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '100%',
                    height: '3px',
                    background: 'linear-gradient(to right, #6495ED, #FFB6C1)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    animation: 'underline 1s ease-out forwards',
                  },
                  '@keyframes underline': {
                    to: { transform: 'scaleX(1)' }
                  }
                }}
              >
                Cakes for Events
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #6495ED, #FFB6C1)',
                boxShadow: '0 4px 12px rgba(100, 149, 237, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(100, 149, 237, 0.4)',
                  background: 'linear-gradient(45deg, #FFB6C1, #6495ED)',
                },
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}
              startIcon={<Add />}
              onClick={() => navigate('/create-user-project')}
            >
              Create New Project
            </Button>
          </Box>
          
          {/* Filter toolbar */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
            background: 'rgba(255,255,255,0.7)',
            p: 2,
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(8px)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<SearchRounded sx={{ color: '#6495ED !important' }} />} 
                label={`${filteredProjects.length} Project${filteredProjects.length !== 1 ? 's' : ''}`} 
                sx={{ 
                  borderColor: '#6495ED',
                  color: '#2D3748',
                  fontWeight: '500',
                  background: 'rgba(255,255,255,0.9)',
                  '& .MuiChip-icon': { color: '#6495ED' }
                }}
                variant="outlined"
              />
              <TextField
                placeholder="Search by cake name"
                value={searchQuery}
                onChange={handleSearchChange}
                size="small"
                sx={{
                  width: { xs: '100%', sm: '200px' },
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: '#6495ED',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded sx={{ color: '#6495ED' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} size="small">
                        <Clear sx={{ color: '#6B7280' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box>
              <Button 
                startIcon={<SortRounded />} 
                variant="outlined" 
                size="small"
                onClick={handleSortMenuOpen}
                sx={{
                  borderColor: '#6495ED',
                  color: '#2D3748',
                  background: 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    borderColor: '#FFB6C1',
                    background: 'rgba(255,255,255,1)',
                  }
                }}
              >
                Sort Projects
              </Button>
              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    mt: 1
                  }
                }}
              >
                <MenuItem onClick={handleSortMenuClose}>Newest First</MenuItem>
                <MenuItem onClick={handleSortMenuClose}>Oldest First</MenuItem>
                <MenuItem onClick={handleSortMenuClose}>Alphabetical (A-Z)</MenuItem>
              </Menu>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 5, borderColor: 'rgba(100, 149, 237, 0.2)' }} />
          
          {/* Project Grid */}
          <Grid container spacing={3}>
            {loading ? renderSkeletons() : (
              filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <Grid item xs={12} sm={6} md={4} key={project.id}>
                    <Grow 
                      in={fadeIn}
                      style={{ transformOrigin: '0 0 0' }}
                      timeout={(index + 1) * 200}
                    >
                      <Card 
                        sx={{ 
                          height: '100%',
                          borderRadius: '16px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                          '&:hover': {
                            transform: 'translateY(-6px) scale(1.02)',
                            boxShadow: '0 12px 24px rgba(100, 149, 237, 0.2)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '6px',
                            background: `linear-gradient(to right, ${getRandomColor(project.id)}, ${getRandomColor(project.id)}80)`,
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '12px',
                            height: '12px',
                            background: getRandomColor(project.id),
                            borderRadius: '50%',
                            opacity: 0.3,
                          }
                        }}
                      >
                        <CardHeader
                          avatar={
                            <Avatar 
                              sx={{ 
                                bgcolor: getRandomColor(project.id),
                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                fontWeight: '600',
                                width: 48,
                                height: 48,
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'rotate(360deg)' }
                              }}
                            >
                              {getProjectInitial(project.title)}
                            </Avatar>
                          }
                          action={
                            <IconButton 
                              aria-label="project settings"
                              onClick={(e) => handleMenuOpen(e, project)}
                              sx={{
                                background: 'rgba(255,255,255,0.7)',
                                '&:hover': { background: 'rgba(255,255,255,0.9)' }
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          }
                          title={
                            <Typography 
                              variant="h6" 
                              fontWeight="600"
                              noWrap
                              sx={{ 
                                maxWidth: '200px',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                color: '#2D3748',
                                letterSpacing: '0.2px'
                              }}
                            >
                              {project.title}
                            </Typography>
                          }
                          subheader={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Event fontSize="small" sx={{ mr: 0.5, color: '#6B7280', fontSize: '0.875rem' }} />
                              <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: '500' }}>
                                {formatDate(project.date)}
                              </Typography>
                            </Box>
                          }
                        />
                        <CardContent sx={{ pb: 0 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mb: 2,
                              color: '#4B5563',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              height: '3.6em',
                              lineHeight: '1.2em',
                              fontWeight: '400'
                            }}
                          >
                            {project.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', mt: 2 }}>
                            <Chip 
                              label={`${getProgressCount(project)} updates`} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.75rem',
                                borderColor: getRandomColor(project.id),
                                color: getRandomColor(project.id),
                                background: 'rgba(255,255,255,0.9)',
                                fontWeight: '500'
                              }}
                            />
                          </Box>
                        </CardContent>
                        <CardActions sx={{ padding: 2, pt: 1, justifyContent: 'flex-end' }}>
                          <Button
                            component={Link}
                            to={`/user-project/${project.id}`}
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            sx={{
                              mr: 1,
                              borderColor: '#6495ED',
                              color: '#6495ED',
                              background: 'rgba(255,255,255,0.9)',
                              '&:hover': {
                                background: '#6495ED',
                                color: '#fff',
                              }
                            }}
                          >
                            View
                          </Button>
                          <Button
                            component={Link}
                            to={`/user-project/${project.id}/update`}
                            variant="outlined"
                            size="small"
                            startIcon={<Edit />}
                            sx={{
                              borderColor: '#FFB6C1',
                              color: '#FFB6C1',
                              background: 'rgba(255,255,255,0.9)',
                              '&:hover': {
                                background: '#FFB6C1',
                                color: '#fff',
                              }
                            }}
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
                      py: 10,
                      px: 4,
                      background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                      borderRadius: '16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      border: '1px dashed rgba(100, 149, 237, 0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '100px',
                      height: '100px',
                      background: 'radial-gradient(circle, rgba(100, 149, 237, 0.2), transparent 70%)',
                    }} />
                    <NoPhotography sx={{ fontSize: 64, color: '#6B7280', mb: 3, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
                    <Typography variant="h5" sx={{ color: '#2D3748', mb: 2, fontWeight: '600' }}>
                      {searchQuery ? 'No Projects Found' : 'No Projects Yet'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#4B5563', mb: 4, textAlign: 'center', maxWidth: '400px' }}>
                      {searchQuery 
                        ? 'No projects match your search. Try a different cake name or create a new project!'
                        : 'Start your creative journey by crafting your first cake project. Click below to begin!'}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate('/create-user-project')}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        background: 'linear-gradient(45deg, #6495ED, #FFB6C1)',
                        boxShadow: '0 4px 12px rgba(100, 149, 237, 0.3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(100, 149, 237, 0.4)',
                        }
                      }}
                    >
                      Create Your First Project
                    </Button>
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        </Box>
        
        {/* Project Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              mt: 1
            }
          }}
        >
          <MenuItem 
            component={Link} 
            to={selectedProject ? `/user-project/${selectedProject.id}` : '#'}
            onClick={handleMenuClose}
            sx={{ py: 1.5 }}
          >
            <Visibility fontSize="small" sx={{ mr: 1, color: '#6495ED' }} /> View Details
          </MenuItem>
          <MenuItem 
            component={Link} 
            to={selectedProject ? `/user-project/${selectedProject.id}/update` : '#'}
            onClick={handleMenuClose}
            sx={{ py: 1.5 }}
          >
            <Edit fontSize="small" sx={{ mr: 1, color: '#FFB6C1' }} /> Edit Project
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => {
              handleMenuClose();
              if (selectedProject) handleDeleteClick(selectedProject);
            }}
            sx={{ py: 1.5, color: '#EF4444' }}
          >
            <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Project
          </MenuItem>
        </Menu>
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: { 
              borderRadius: '16px', 
              padding: '12px',
              background: 'linear-gradient(145deg, #ffffff, #f8f9fa)'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Delete sx={{ mr: 1, color: '#EF4444' }} />
              <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: '600' }}>
                Confirm Deletion
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#4B5563' }}>
              Are you sure you want to delete the project "<strong>{selectedProject?.title}</strong>"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ pb: 2, px: 3 }}>
            <Button 
              onClick={handleDeleteCancel} 
              variant="outlined"
              sx={{
               

 borderColor: '#6495ED',
                color: '#6495ED',
                '&:hover': { borderColor: '#4B5563' }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              variant="contained"
              sx={{
                background: '#EF4444',
                '&:hover': { background: '#DC2626' }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Fade>
  );
}

export default UserProjectList;