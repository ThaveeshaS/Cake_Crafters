"use client"

import { useState } from "react"
import { Button, TextField, Typography, Box, Paper, CircularProgress } from "@mui/material"
import { addComment } from "../services/api"
import { Comment as CommentIcon } from "@mui/icons-material"
import { motion } from "framer-motion"

function CommentForm({ postId, onCommentAdded }) {
  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (text.trim() === "") {
      setError("Comment cannot be empty")
      return
    }
    setError("")
    setIsSubmitting(true)
    try {
      await addComment(postId, { text })
      setText("")
      onCommentAdded()
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error adding comment:", error)
      setError("Failed to add comment: " + (error.response?.data || error.message))
      setIsSubmitting(false)
    }
  }

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
        <Paper
          sx={{
            p: 3,
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(15, 12, 41, 0.85) 0%, rgba(48, 43, 99, 0.85) 50%, rgba(36, 36, 62, 0.85) 100%)",
            boxShadow: "0 10px 30px rgba(111, 66, 193, 0.3), 0 0 20px rgba(80, 250, 250, 0.2)",
            border: "1px solid rgba(120, 250, 250, 0.2)",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Add a comment"
              value={text}
              onChange={(e) => setText(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={2}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(20, 20, 40, 0.6)",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  color: "#fff",
                  "&:hover": {
                    boxShadow: "0 0 15px rgba(80, 250, 250, 0.3)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 20px rgba(80, 250, 250, 0.4)",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(80, 250, 250, 0.3)",
                  borderWidth: "2px",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#50fafa",
                  borderWidth: "2px",
                },
                "& .MuiInputLabel-root": {
                  color: "#a0a0ff",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#50fafa",
                },
                "& .MuiInputBase-input": {
                  color: "rgba(255, 255, 255, 0.9)",
                },
              }}
              className="hover-scale"
              helperText={error || (text.trim() === '' ? 'Comment is required' : '')}
              error={!!error || text.trim() === ''}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || text.trim() === ''}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: "12px",
                background: "linear-gradient(90deg, #ff00cc, #3393ff)",
                color: "white",
                fontWeight: 600,
                boxShadow: "0 0 20px rgba(111, 66, 193, 0.4)",
                transition: "all 0.3s ease",
                border: "none",
                "&:hover": {
                  background: "linear-gradient(90deg, #ff00cc, #3393ff)",
                  boxShadow: "0 0 30px rgba(111, 66, 193, 0.6)",
                  transform: "translateY(-3px)",
                },
                "&:disabled": {
                  background: "linear-gradient(90deg, #666, #999)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
              startIcon={<CommentIcon />}
              className="button-animation neon-button"
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Adding...
                </>
              ) : (
                "Add Comment"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>

      <style jsx>{`
        .hover-scale {
          transition: transform 0.2s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.01);
        }
        
        .button-animation {
          transition: transform 0.2s ease;
        }
        
        .button-animation:hover {
          transform: scale(1.03);
        }
        
        .button-animation:active {
          transform: scale(0.97);
        }
        
        .neon-button {
          position: relative;
        }
        
        .neon-button::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff00cc, #3393ff, #00ffcc, #ff00cc);
          background-size: 400% 400%;
          z-index: -1;
          borderRadius: 14px;
          animation: gradientBorder 3s ease infinite;
          opacity: 0.7;
          filter: blur(5px);
        }
        
        @keyframes gradientBorder {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </Box>
  )
}

export default CommentForm