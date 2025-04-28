import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress } from '@mui/material'; // Added CircularProgress
import PostCard from './PostCard';
import { getPosts } from '../services/api';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    getPosts()
      .then((response) => {
        setPosts(response.data || []);
        setIsLoading(false); // Update loading state
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts');
        setIsLoading(false); // Update loading state even on error
      });
  }, []);

  return (
    <div>
      <Typography variant="h4" color="#ff6f61" gutterBottom>
        Cake Posts
      </Typography>
      
      {/* Added loading spinner */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress color="secondary" />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      ) : posts.length === 0 ? (
        // Enhanced empty state
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fff8f0' }}>
          <Typography variant="h6" color="text.secondary">
            No posts yet. Bake something amazing and share it!
          </Typography>
        </Paper>
      ) : (
        posts.map((post) => <PostCard key={post.postId} post={post} />)
      )}
    </div>
  );
}

export default PostList;