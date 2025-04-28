"use client"

import { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import { motion } from "framer-motion"
import { getPosts } from "../services/api"
import PostCard from "./PostCard"

function PostList() {
  const [posts, setPosts] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    getPosts()
      .then((response) => {
        setPosts(response.data)
      })
      .catch((error) => {
        console.error('Error fetching posts:', error)
        setError('Failed to fetch posts')
      })
  }, [])

  return (
    <Box sx={{ position: "relative", minHeight: "calc(100vh - 128px)" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          opacity: { duration: 1 },
          backgroundPosition: {
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
          },
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          background: "linear-gradient(135deg, #ff7bac, #3393ff, #00ffcc)",
          backgroundSize: "200% 200%",
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1, padding: "20px" }}>
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}
        {posts.length === 0 && !error && (
          <Typography sx={{ textAlign: "center", color: "#fff" }}>
            No posts available
          </Typography>
        )}
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </Box>
    </Box>
  )
}

export default PostList