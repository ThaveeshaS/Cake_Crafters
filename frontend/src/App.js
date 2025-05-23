import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';

import EditPost from './components/EditPost';
import { Container} from '@mui/material';

import './App.css';

import Header from './components/Elements/Header';
import Navbar from './components/Elements/Navbar';
import Footer from './components/Elements/Footer';
import DisplayCakeRecipe from './components/CakeRecipe/DisplayCakeRecipe';
import AddNewCakeRecipe from './components/CakeRecipe/AddNewCakeRecipe';
import CakeRecipeDetails from './components/CakeRecipe/CakeRecipeDetails';
import UpdateRecipeForm from './components/CakeRecipe/UpdateRecipeForm';
import VoiceNavigator from './components/Elements/VoiceNavigator';
import 'bootstrap/dist/css/bootstrap.min.css';

import DecoratingForm from './components/DecorationTips/DecoratingForm';
import DecorationTips from './components/DecorationTips/DecorationTips';
import DisplayDecorationTip from './components/DecorationTips/DisplayDecorationTip';


import UserProjectList from './components/UserProjects/UserProjectList';
import CreateUserProject from './components/UserProjects/CreateUserProject';
import UserProjectDetails from './components/UserProjects/UserProjectDetails';
import UpdateUserProject from './components/UserProjects/UpdateUserProject';



function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/create" element={<CreatePost />} />

          <Route path="/edit/:postId" element={<EditPost />} />


          <Route path="/decorationtips" element={<DecorationTips />} />
          <Route path="/create-decoration-tips" element={<DecoratingForm />} />
          <Route path="/display-decoration-tip/:id" element={<DisplayDecorationTip />} />

          <Route path="/displaycakerecipe" element={<DisplayCakeRecipe />} />
          <Route path="/addnewcakerecipe" element={<AddNewCakeRecipe />} />
          <Route path="/recipe/:id" element={<CakeRecipeDetails />} />
          <Route path="/recipe/:id/update" element={<UpdateRecipeForm />} />
          <Route path="/voice" element={<VoiceNavigator />} />

          <Route path="/cakesforevents" element={<UserProjectList />} />
          <Route path="/create-user-project" element={<CreateUserProject />} />
          <Route path="/user-project/:id" element={<UserProjectDetails />} />
          <Route path="/user-project/:id/update" element={<UpdateUserProject />} />

        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;