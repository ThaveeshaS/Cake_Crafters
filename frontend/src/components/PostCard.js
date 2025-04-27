import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Divider, Button } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { likePost, dislikePost, deletePost } from '../services/api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [dislikes, setDislikes] = useState(post.dislikesCount || 0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLike = async () => {
    try {
      await likePost(post.postId);
      setLikes(likes + 1);
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post');
    }
  };

  const handleDislike = async () => {
    try {
      await dislikePost(post.postId);
      setDislikes(dislikes + 1);
    } catch (error) {
      console.error('Error disliking post:', error);
      setError('Failed to dislike post');
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.postId);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };

  const handleEditPost = () => {
    navigate(`/edit/${post.postId}`);
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 4, borderRadius: 3, bgcolor: '#fef7f0' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="#ff6f61" gutterBottom>
            {post.description}
          </Typography>
          <Box>
            <IconButton onClick={handleEditPost} sx={{ color: '#ff6f61' }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDeletePost} sx={{ color: '#ff6f61' }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
          {post.mediaUrls && post.mediaUrls.length > 0 ? (
            post.mediaUrls.map((base64, index) => (
              <CardMedia
                key={index}
                component={base64.startsWith('data:video') ? 'video' : 'img'}
                src={base64}
                controls={base64.startsWith('data:video')}
                sx={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 2 }}
              />
            ))
          ) : (
            <Typography color="text.secondary">No images available</Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Likes: {likes}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dislikes: {dislikes}
          </Typography>
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <IconButton onClick={handleLike} sx={{ color: '#ff6f61' }}>
            <ThumbUpIcon />
          </IconButton>
          <IconButton onClick={handleDislike} sx={{ color: '#ff6f61' }}>
            <ThumbDownIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />
        <CommentList postId={post.postId} />
        <CommentForm postId={post.postId} />
      </CardContent>
    </Card>
  );
}

export default PostCard;