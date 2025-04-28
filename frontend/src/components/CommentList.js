"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Paper, CircularProgress } from "@mui/material"
import { motion } from "framer-motion"
import { getComments } from "../services/api"

function CommentList({ postId }) {
  const [comments, setComments] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getComments(postId)
      .then((response) => {
        setComments(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching comments:', error)
        setError('Failed to fetch comments')
        setIsLoading(false)
      })
  }, [postId])

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
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
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 600, mx: "auto" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        ) : comments.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "#fff" }}>
            No comments yet
          </Typography>
        ) : (
          comments.map((comment) => (
            <Paper
              key={comment.id}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "8px",
                background: "linear-gradient(135deg, rgba(15, 12, 41, 0.85) 0%, rgba(48, 43, 99, 0.85) 50%, rgba(36, 36, 62, 0.85) 100%)",
                boxShadow: "0 5px 15px rgba(111, 66, 193, 0.3)",
                border: "1px solid rgba(120, 250, 250, 0.2)",
              }}
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  background: "linear-gradient(90deg, #ff7bac, #ff9a8d)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {comment.text}
              </Typography>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  )
}

export default CommentList