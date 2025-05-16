"use client"

import { useState } from "react"
import { Button, TextField, Typography, Box, Paper, CircularProgress } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { createPost } from "../services/api"
import { CloudUpload as UploadIcon, Cake as CakeIcon, Close as CloseIcon } from "@mui/icons-material"
import { motion } from "framer-motion"

function CreatePost() {
  const [description, setDescription] = useState("")
  const [mediaBase64, setMediaBase64] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 3) {
      setError("Max 3 files allowed!")
      return
    }
    setError("")

    const base64Promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(base64Promises)
      .then((base64Strings) => {
        setMediaBase64(base64Strings)
        setPreviews(base64Strings)
      })
      .catch((error) => {
        setError("Failed to process images: " + error.message)
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    const post = { description, mediaUrls: mediaBase64 }
    try {
      await createPost(post)
      navigate("/")
    } catch (error) {
      console.error("Error creating post:", error)
      setError("Failed to create post: " + (error.response?.data || error.message))
      setIsSubmitting(false)
    }
  }

  const removeImage = (index) => {
    const newPreviews = [...previews]
    const newMediaBase64 = [...mediaBase64]
    newPreviews.splice(index, 1)
    newMediaBase64.splice(index, 1)
    setPreviews(newPreviews)
    setMediaBase64(newMediaBase64)
  }

  return (
    <Box sx={{ position: "relative", minHeight: "calc(100vh - 128px)" /* Adjust for header/footer */ }}>
      {/* Animated Gradient Background */}
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

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 1, padding: "20px" }}>
        <Paper
          sx={{
            p: 4,
            maxWidth: 700,
            mx: "auto",
            mt: 4,
            mb: 4, // Ensure space for footer
            boxShadow: "0 10px 30px rgba(111, 66, 193, 0.3), 0 0 20px rgba(80, 250, 250, 0.2)",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(15, 12, 41, 0.85) 0%, rgba(48, 43, 99, 0.85) 50%, rgba(36, 36, 62, 0.85) 100%)",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(120, 250, 250, 0.2)",
            backdropFilter: "blur(10px)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: "linear-gradient(90deg, #ff00cc, #3393ff, #00ffcc)",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            },
          }}
        >
          <div className="futuristic-header">
            <div className="header-glow"></div>
            <CakeIcon sx={{ color: "#ff7bac", fontSize: 40 }} className="header-icon" />
            <Typography
              variant="h4"
              sx={{
                background: "linear-gradient(90deg, #ff7bac, #ff9a8d, #3393ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
                textShadow: "0 0 10px rgba(255, 123, 172, 0.3)",
                position: "relative",
                zIndex: 2,
              }}
            >
              Share Your Cake Creation
            </Typography>
            <div className="header-circuit"></div>
          </div>

          {error && (
            <Typography
              color="error"
              sx={{
                mb: 2,
                p: 2,
                bgcolor: "rgba(255, 0, 0, 0.15)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(255, 0, 0, 0.3)",
                boxShadow: "0 0 10px rgba(255, 0, 0, 0.2)",
              }}
            >
              <CloseIcon sx={{ mr: 1, fontSize: 18, color: "#ff5555" }} />
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Describe your cake"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
              sx={{
                mb: 3,
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
              helperText={description.trim() === '' ? 'Description is required' : ''}
              error={description.trim() === ''}
            />

            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              sx={{
                mb: 2,
                py: 1.5,
                px: 3,
                borderRadius: "12px",
                borderWidth: "2px",
                borderColor: "#50fafa",
                color: "#50fafa",
                fontWeight: 600,
                transition: "all 0.3s ease",
                background: "rgba(80, 250, 250, 0.05)",
                "&:hover": {
                  borderWidth: "2px",
                  borderColor: "#50fafa",
                  bgcolor: "rgba(80, 250, 250, 0.15)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 0 15px rgba(80, 250, 250, 0.4)",
                },
              }}
              className="button-animation cyber-btn"
            >
              Upload Media (Max 3)
              <input type="file" hidden accept="image/*" multiple onChange={handleFileChange} />
            </Button>

            <Typography
              variant="caption"
              color={mediaBase64.length === 0 ? "error" : "text.secondary"}
              sx={{ display: "block", mb: 2 }}
            >
              {mediaBase64.length === 0 ? "At least one image is required" : `${mediaBase64.length} image(s) selected`}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
              {previews.map((base64, index) => (
                <div key={index} className="image-animation" style={{ animationDelay: `${index * 100}ms` }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: 140,
                      height: 140,
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 0 15px rgba(111, 66, 193, 0.4)",
                      transition: "all 0.3s ease",
                      border: "2px solid rgba(111, 66, 193, 0.5)",
                      "&:hover": {
                        transform: "scale(1.05) rotate(2deg)",
                        boxShadow: "0 0 20px rgba(111, 66, 193, 0.6), 0 0 30px rgba(80, 250, 250, 0.3)",
                        border: "2px solid rgba(80, 250, 250, 0.5)",
                      },
                    }}
                    className="cyber-image"
                  >
                    <Box
                      component="img"
                      src={base64}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      onClick={() => removeImage(index)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(20, 20, 40, 0.7)",
                        borderRadius: "50%",
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        border: "1px solid rgba(255, 123, 172, 0.5)",
                        "&:hover": {
                          bgcolor: "rgba(20, 20, 40, 0.9)",
                          transform: "scale(1.1)",
                          boxShadow: "0 0 10px rgba(255, 123, 172, 0.5)",
                        },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 16, color: "#ff7bac" }} />
                    </Box>
                  </Box>
                </div>
              ))}
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || description.trim() === '' || mediaBase64.length === 0}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: "12px",
                background: "linear-gradient(90deg, #ff00cc, #3393ff)",
                color: "white",
                fontWeight: 600,
                boxShadow: "0 0 20px rgba(111, 66, 193, 0.4)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                border: "none",
                "&:hover": {
                  background: "linear-gradient(90deg, #ff00cc, #3393ff)",
                  boxShadow: "0 0 30px rgba(111, 66, 193, 0.6), 0 0 10px rgba(80, 250, 250, 0.3)",
                  transform: "translateY(-3px)",
                },
                "&:disabled": {
                  background: "linear-gradient(90deg, #666, #999)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
              className="button-animation neon-button"
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Share Post"}
              {!isSubmitting && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                    background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
                    transform: "scale(0)",
                    transition: "transform 0.5s ease-out, opacity 0.3s ease",
                    "&:hover": {
                      opacity: 0.5,
                      transform: "scale(2)",
                    },
                  }}
                />
              )}
            </Button>
          </Box>
        </Paper>
      </Box>

      <style jsx>{`
        .futuristic-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          position: relative;
          padding: 15px 0;
          flex-direction: column;
          text-align: center;
        }
        
        .header-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(111, 66, 193, 0.3) 0%, transparent 70%);
          z-index: 0;
          animation: pulse 4s infinite;
        }
        
        .header-icon {
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 0 8px rgba(255, 123, 172, 0.6));
          margin-bottom: 10px;
          animation: float 3s ease-in-out infinite;
        }
        
        .header-circuit {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(80, 250, 250, 0.3) 20%, 
            rgba(80, 250, 250, 0.8) 50%,
            rgba(80, 250, 250, 0.3) 80%,
            transparent 100%
          );
        }
        
        .header-circuit::before, 
        .header-circuit::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
          borderRadius: 50%;
          background-color: #50fafa;
          bottom: -2.5px;
          animation: circuitMove 4s linear infinite;
        }
        
        .header-circuit::before {
          left: 30%;
          animation-delay: -2s;
        }
        
        .header-circuit::after {
          left: 70%;
        }
        
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
        
        .image-animation {
          opacity: 0;
          transform: scale(0.8);
          animation: fadeInScale 0.3s forwards;
        }
        
        .cyber-btn {
          position: relative;
          overflow: hidden;
        }
        
        .cyber-btn::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 40%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          transition: all 0.3s;
          opacity: 0;
        }
        
        .cyber-btn:hover::after {
          animation: shine 1.5s ease-out;
          opacity: 1;
        }
        
        .cyber-image::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff00cc, #3393ff, #00ffcc, #ff00cc);
          background-size: 400% 400%;
          z-index: -1;
          border-radius: 14px;
          animation: gradientBorder 3s ease infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .cyber-image:hover::before {
          opacity: 1;
        }
        
        .neon-button {
          position: relative;
        }
        
        .neon-button::before {
          content: "";
          position: "absolute",
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: "linear-gradient(45deg, #ff00cc, #3393ff, #00ffcc, #ff00cc)",
          backgroundSize: "400% 400%",
          z-index: -1,
          borderRadius: "14px",
          animation: "gradientBorder 3s ease infinite",
          opacity: 0.7,
          filter: "blur(5px)",
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(0.8);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) rotate(45deg);
          }
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        
        @keyframes circuitMove {
          0% {
            left: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </Box>
  )
}

export default CreatePost

