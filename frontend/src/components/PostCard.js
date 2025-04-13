import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Divider } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { likePost } from '../services/api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [error, setError] = useState('');

  const handleLike = async () => {
    try {
      await likePost(post.postId);
      setLikes(likes + 1);
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post');
    }
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 4, borderRadius: 3, bgcolor: '#fef7f0' }}>
      <CardContent>
        <Typography variant="h6" color="#ff6f61" gutterBottom>
          {post.description}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
          {post.mediaUrls &&
            post.mediaUrls.map((url, index) => (
              <CardMedia
                key={index}
                component={url.includes('.mp4') ? 'video' : 'img'}
                src={url}
                controls={url.includes('.mp4')}
                sx={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 2 }}
              />
            ))}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Likes: {likes}
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <IconButton onClick={handleLike} sx={{ color: '#ff6f61' }}>
            <ThumbUpIcon />
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