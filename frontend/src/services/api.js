import axios from 'axios';

const API_URL = 'http://localhost:8080/api/posts';
const USER_PROJECTS_API_URL = 'http://localhost:8080/api/user-projects';

const api = axios.create({
  baseURL: API_URL,
});

const userProjectsApi = axios.create({
  baseURL: USER_PROJECTS_API_URL,
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

export const deleteComment = (postId, commentId) => {
  console.log('Deleting comment:', commentId, 'from post:', postId);
  return api.delete(`/${postId}/comments/${commentId}`);
};

export const getUserProjects = () => {
  console.log('Fetching user projects from:', USER_PROJECTS_API_URL);
  return userProjectsApi.get('');
};

export const getUserProjectById = (projectId) => {
  console.log('Fetching user project:', projectId);
  return userProjectsApi.get(`/${projectId}`);
};

export const createUserProject = (project) => {
  console.log('Creating user project at:', USER_PROJECTS_API_URL, 'with data:', project);
  return userProjectsApi.post('', project);
};

export const updateUserProject = (projectId, project) => {
  console.log('Updating user project:', projectId, 'with data:', project);
  return userProjectsApi.put(`/${projectId}`, project);
};

export const deleteUserProject = (projectId) => {
  console.log('Deleting user project:', projectId);
  return userProjectsApi.delete(`/${projectId}`);
};

export const addProgressUpdate = (projectId, progressUpdate) => {
  console.log('Adding progress update to project:', projectId, 'update:', progressUpdate);
  // Ensure the progressUpdate is sent as a plain string
  return userProjectsApi.post(`/${projectId}/progress`, progressUpdate, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};