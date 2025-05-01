import axios from 'axios';

const USER_PROJECTS_API_URL = 'http://localhost:8080/api/user-projects';

const userProjectsApi = axios.create({
  baseURL: USER_PROJECTS_API_URL,
});

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