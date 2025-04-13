import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';

function CreatePost() {
  const [description, setDescription] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError('Max 3 files allowed!');
      return;
    }
    setError('');
    setMediaUrls(files.map((_, index) => `http://example.com/cake${index + 1}.jpg`));
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const post = { description, mediaUrls };
    try {
      await createPost(post);
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Failed to create post';
      setError(typeof errorMessage === 'string' ? errorMessage : 'An unexpected error occurred');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto', mt: 4, boxShadow: 4, bgcolor: '#fef7f0' }}>
      <Typography variant="h4" color="#ff6f61" gutterBottom>
        Share Your Cake Creation
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Failed to create post: {error}
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Describe your cake"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          sx={{ bgcolor: 'white' }}
        />
        <Button
          variant="outlined"
          component="label"
          sx={{ mb: 2, borderColor: '#ff6f61', color: '#ff6f61' }}
        >
          Upload Media (Max 3)
          <input
            type="file"
            hidden
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
          />
        </Button>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
          {previews.map((url, index) => (
            <Box
              key={index}
              component="img"
              src={url}
              sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 2 }}
            />
          ))}
        </Box>
        <Button type="submit" variant="contained" sx={{ bgcolor: '#ff6f61', '&:hover': { bgcolor: '#e55a50' } }}>
          Share Post
        </Button>
      </Box>
    </Paper>
  );
}

export default CreatePost;