import React, { useState } from 'react';
import { 
  Card, CardContent, CardMedia, Typography, Box, 
  IconButton, Divider, Button, Dialog, DialogActions, 
  DialogContent, DialogContentText, DialogTitle // Added Dialog components
} from '@mui/material';
// ... other imports remain same

function PostCard({ post }) {
  // ... existing state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Added dialog state

  // ... existing handlers

  const handleDeletePost = async () => {
    try {
      await deletePost(post.postId);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    } finally {
      setOpenDeleteDialog(false); // Close dialog
    }
  };

  return (
    <Card sx={{ 
      mb: 3, 
      boxShadow: 4, 
      borderRadius: 3, 
      bgcolor: '#fef7f0',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Added transition
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(255, 111, 97, 0.2)'
      }
    }}>
      {/* ... existing card content */}

      {/* Added delete confirmation dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Post?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this cake post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletePost} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default PostCard;