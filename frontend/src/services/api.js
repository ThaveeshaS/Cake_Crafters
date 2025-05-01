import axios from 'axios';

const API_URL = 'http://localhost:8080/api/posts';

const api = axios.create({
  baseURL: API_URL,
});

export const getPosts = () => {
  console.log('Fetching posts from:', API_URL);
  return api.get('');
};

export const createPost = (post) => {
  console.log('Sending POST request to:', API_URL, 'with data:', post);
  return api.post('', post);
};

export const updatePost = (postId, post) => {
  console.log('Updating post:', postId, 'with data:', post);
  return api.put(`/${postId}`, post);
};

export const likePost = (postId) => {
  console.log('Liking post:', postId);
  return api.post(`/${postId}/likes`);
};

export const dislikePost = (postId) => {
  console.log('Disliking post:', postId);
  return api.post(`/${postId}/dislikes`);
};

export const deletePost = (postId) => {
  console.log('Deleting post:', postId);
  return api.delete(`/${postId}`);
};

export const addComment = (postId, comment) => {
  console.log('Adding comment to post:', postId, 'comment:', comment);
  return api.post(`/${postId}/comments`, comment);
};

export const updateComment = (postId, commentId, comment) => {
  console.log('Updating comment:', commentId, 'for post:', postId, 'with data:', comment);
  return api.put(`/${postId}/comments/${commentId}`, comment);
};

export const deleteComment = (postId, commentId) => {
  console.log('Deleting comment:', commentId, 'from post:', postId);
  return api.delete(`/${postId}/comments/${commentId}`);
};