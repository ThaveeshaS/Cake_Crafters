import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { addComment } from '../services/api';

function CommentForm({ postId }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    setError('');
    const comment = { content };
    try {
      await addComment(postId, comment);
      setContent('');
      window.location.reload();
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Add a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        sx={{ bgcolor: 'white' }}
      />
      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained" sx={{ bgcolor: '#ff6f61', '&:hover': { bgcolor: '#e55a50' } }}>
        Comment
      </Button>
    </Box>
  );
}

export default CommentForm;