import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getPosts, deleteComment } from '../services/api';
import CommentForm from './CommentForm';

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);

  useEffect(() => {
    getPosts()
      .then((response) => {
        const post = response.data.find((p) => p.postId === postId);
        if (post && post.comments) {
          setComments(Object.entries(post.comments).map(([id, comment]) => ({ commentId: id, ...comment })));
        } else {
          setComments([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
        setError('Failed to fetch comments');
      });
  }, [postId]);

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(postId, commentId);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    }
  };

  const handleEditComment = (commentId) => {
    setEditingCommentId(commentId);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" color="#ff6f61">
        Comments
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {comments.length === 0 && !error ? (
        <Typography color="text.secondary">No comments yet.</Typography>
      ) : (
        comments.map((comment) => (
          <Box key={comment.commentId}>
            {editingCommentId === comment.commentId ? (
              <CommentForm
                postId={postId}
                comment={comment}
                onCancelEdit={handleCancelEdit}
              />
            ) : (
              <Paper sx={{ p: 2, mb: 1, bgcolor: '#fff8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography>{comment.content}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {comment.createdAt}
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => handleEditComment(comment.commentId)} sx={{ color: '#ff6f61' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteComment(comment.commentId)} sx={{ color: '#ff6f61' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            )}
          </Box>
        ))
      )}
    </Box>
  );
}

export default CommentList;