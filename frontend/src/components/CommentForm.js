import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { addComment, updateComment } from '../services/api';

function CommentForm({ postId, comment, onCancelEdit }) {
  const [content, setContent] = useState(comment ? comment.content : '');
  const [error, setError] = useState('');
  const isEditMode = !!comment;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    setError('');
    const commentData = { content };
    try {
      if (isEditMode) {
        await updateComment(postId, comment.commentId, commentData);
      } else {
        await addComment(postId, commentData);
      }
      setContent('');
      if (onCancelEdit) onCancelEdit();
      window.location.reload();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} comment:`, error);
      setError(`Failed to ${isEditMode ? 'update' : 'add'} comment`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label={isEditMode ? "Edit your comment" : "Add a comment"}
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
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ bgcolor: '#ff6f61', '&:hover': { bgcolor: '#e55a50' } }}
        >
          {isEditMode ? 'Update' : 'Comment'}
        </Button>
        {isEditMode && (
          <Button
            variant="outlined"
            onClick={onCancelEdit}
            sx={{ color: '#ff6f61', borderColor: '#ff6f61' }}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default CommentForm;