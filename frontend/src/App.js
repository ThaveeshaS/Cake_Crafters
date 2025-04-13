import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import { Container} from '@mui/material';
import './App.css';

import Header from './components/Elements/Header'
import Footer from './components/Elements/Footer'
import Navbar from './components/Elements/Navbar'


import DecoratingForm from './components/DecorationTips/DecoratingForm';
import DecorationTips from './components/DecorationTips/DecorationTips';



function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/create" element={<CreatePost />} />



          <Route path="/decorationtips" element={<DecorationTips />} />
          <Route path="/create-decoration-tips" element={<DecoratingForm />} />
          
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;