import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import { Container} from '@mui/material';
import './App.css';

import Header from './components/Elements/Header'
import Footer from './components/Elements/Footer'
import Navbar from './components/Elements/Navbar'

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;