import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';
import PostCard from './PostCard';
import { getPosts } from '../services/api';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // NEW: Loading state

  useEffect(() => {
    getPosts()
      .then((response) => {
        setPosts(response.data || []);
        setIsLoading(false); // NEW: Set loading false after data
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts');
        setIsLoading(false); // NEW: Set loading false on error too
      });
  }, []);

  return (
    <div>
      <Typography variant="h4" color="#ff6f61" gutterBottom>
        Cake Posts
      </Typography>
      
      {/* NEW: Loading spinner */}
      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress color="secondary" />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* NEW: Enhanced empty state */}
      {!isLoading && posts.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No posts yet. Be the first to share your cake creation!
          </Typography>
        </Box>
      )}

      {posts.map((post) => (
        <PostCard key={post.postId} post={post} />
      ))}
    </div>
  );
}

export default PostList;