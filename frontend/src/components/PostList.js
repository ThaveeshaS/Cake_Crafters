import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';
import PostCard from './PostCard';
import { getPosts } from '../services/api';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPosts()
      .then((response) => {
        setPosts(response.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Typography variant="h4" color="#ff6f61" gutterBottom>
        Cake Posts
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {posts.length === 0 && !error ? (
            <Typography color="text.secondary">No posts yet. Create one!</Typography>
          ) : (
            posts.map((post) => <PostCard key={post.postId} post={post} />)
          )}
        </>
      )}
    </div>
  );
}

export default PostList;