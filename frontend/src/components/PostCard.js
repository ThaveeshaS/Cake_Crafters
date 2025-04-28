"use client"

import { Box, Card, CardContent, Typography } from "@mui/material"
import { motion } from "framer-motion"

function PostCard({ post }) {
  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: "auto",
        my: 2,
        borderRadius: "12px",
        background: "linear-gradient(135deg, rgba(15, 12, 41, 0.85) 0%, rgba(48, 43, 99, 0.85) 50%, rgba(36, 36, 62, 0.85) 100%)",
        boxShadow: "0 10px 30px rgba(111, 66, 193, 0.3), 0 0 20px rgba(80, 250, 250, 0.2)",
        border: "1px solid rgba(120, 250, 250, 0.2)",
        backdropFilter: "blur(10px)",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            mb: 2,
            background: "linear-gradient(90deg, #ff7bac, #ff9a8d, #3393ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {post.description}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {post.mediaUrls.map((url, index) => (
            <Box
              key={index}
              sx={{
                width: 140,
                height: 140,
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 0 10px rgba(111, 66, 193, 0.4)",
              }}
            >
              {url.startsWith('data:video') ? (
                <Box
                  component="video"
                  src={url}
                  controls
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Box
                  component="img"
                  src={url}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default PostCard