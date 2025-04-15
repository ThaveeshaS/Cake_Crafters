import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import { Container} from '@mui/material';
import './App.css';

import Header from './components/Elements/Header';
import Navbar from './components/Elements/Navbar';
import Footer from './components/Elements/Footer';
import DisplayCakeRecipe from './components/CakeRecipe/DisplayCakeRecipe';
import AddNewCakeRecipe from './components/CakeRecipe/AddNewCakeRecipe';
import CakeRecipeDetails from './components/CakeRecipe/CakeRecipeDetails';
import UpdateRecipeForm from './components/CakeRecipe/UpdateRecipeForm';

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/create" element={<CreatePost />} />
          
          <Route path="/displaycakerecipe" element={<DisplayCakeRecipe />} />
          <Route path="/addnewcakerecipe" element={<AddNewCakeRecipe />} />
          <Route path="/recipe/:id" element={<CakeRecipeDetails />} />
          <Route path="/recipe/:id/update" element={<UpdateRecipeForm />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;