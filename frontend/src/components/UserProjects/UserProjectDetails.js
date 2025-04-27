import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProjectById, addProgressUpdate } from '../../services/api';
import { Typography, Button, TextField, Box, List, ListItem, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

function UserProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [progressUpdate, setProgressUpdate] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
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
      };
      reader.readAsDataURL(file);
    }
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

  if (!project) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {project.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {project.description}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Created on: {project.date}
      </Typography>
      <Typography variant="h6" sx={{ marginTop: '20px' }}>
        Progress Updates
      </Typography>
      <List>
        {project.progressUpdates && project.progressUpdates.length > 0 ? (
          project.progressUpdates.map((update, index) => {
            const cleanedUpdate = cleanUpdate(update);
            return (
              <ListItem key={index}>
                {isImage(cleanedUpdate) ? (
                  <img
                    src={cleanedUpdate}
                    alt="Progress update"
                    style={{ maxWidth: '200px', maxHeight: '200px', margin: '10px 0' }}
                  />
                ) : (
                  <Typography>{cleanedUpdate}</Typography>
                )}
              </ListItem>
            );
          })
        ) : (
          <Typography>No progress updates yet.</Typography>
        )}
      </List>
      <Box sx={{ marginTop: '20px' }}>
        <TextField
          label="Add Progress Update (Text)"
          value={progressUpdate}
          onChange={(e) => setProgressUpdate(e.target.value)}
          fullWidth
          margin="normal"
          disabled={!!mediaFile}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-media"
            type="file"
            onChange={handleMediaChange}
          />
          <label htmlFor="upload-media">
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          <Typography variant="body2" sx={{ marginLeft: '10px' }}>
            {mediaFile ? 'Image selected' : 'Upload an image (max 5 MB)'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProgressUpdate}
          disabled={!progressUpdate.trim() && !mediaFile}
          sx={{ marginTop: '10px' }}
        >
          Add Update
        </Button>
      </Box>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate('/cakesforevents')}
        style={{ marginTop: '20px' }}
      >
        Back to Projects
      </Button>
    </Box>
  );
}

export default UserProjectDetails;