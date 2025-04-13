import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import { Container} from '@mui/material';
import './App.css';

import Header from './components/Elements/Header';
import Navbar from './components/Elements/Navbar';
import Footer from './components/Elements/Footer';
import CakeRecipe from './components/CakeRecipe/CakeRecipe';
import CreateRecipe from './components/CakeRecipe/CreateRecipe';

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/cakerecipe" element={<CakeRecipe />} />
          <Route path="/createrecipe" element={<CreateRecipe />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;