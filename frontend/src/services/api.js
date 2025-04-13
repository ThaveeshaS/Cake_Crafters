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

export const likePost = (postId) => {
  console.log('Liking post:', postId);
  return api.post(`/${postId}/likes`);
};

export const addComment = (postId, comment) => {
  console.log('Adding comment to post:', postId, 'comment:', comment);
  return api.post(`/${postId}/comments`, comment);
};