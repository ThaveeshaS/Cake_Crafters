package com.cakecrafters.backend.controller;

import com.cakecrafters.backend.model.Comment;
import com.cakecrafters.backend.model.Post;
import com.cakecrafters.backend.service.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private PostService postService;

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        logger.info("Test endpoint accessed");
        return new ResponseEntity<>("Backend is working!", HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        try {
            List<Post> posts = postService.getAllPosts().get();
            logger.info("Fetched {} posts", posts.size());
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error fetching posts", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody Post post) {
        logger.info("Received create post request: {}", post);
        if (post.getMediaUrls() != null && post.getMediaUrls().size() > 3) {
            return new ResponseEntity<>("Max 3 media files allowed", HttpStatus.BAD_REQUEST);
        }
        post.setOwnerId("default-user");
        try {
            String postId = postService.createPost(post).get();
            logger.info("Post created with ID: {}", postId);
            return new ResponseEntity<>(postId, HttpStatus.CREATED);
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error creating post", e);
            return new ResponseEntity<>("Failed to create post: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Void> updatePost(@PathVariable String postId, @RequestBody Post post) {
        try {
            postService.updatePost(postId, post).get();
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (InterruptedException | ExecutionException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable String postId) {
        try {
            postService.deletePost(postId).get();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (InterruptedException | ExecutionException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{postId}/likes")
    public ResponseEntity<Void> likePost(@PathVariable String postId) {
        try {
            postService.likePost(postId).get();
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (InterruptedException | ExecutionException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{postId}/dislikes")
    public ResponseEntity<Void> dislikePost(@PathVariable String postId) {
        try {
            postService.dislikePost(postId).get();
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (InterruptedException | ExecutionException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<String> addComment(@PathVariable String postId, @RequestBody Comment comment) {
        comment.setPostId(postId);
        comment.setUserId("default-user");
        try {
            String commentId = postService.addComment(postId, comment).get();
            return new ResponseEntity<>(commentId, HttpStatus.CREATED);
        } catch (InterruptedException | ExecutionException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> updateComment(@PathVariable String postId, @PathVariable String commentId, @RequestBody Comment comment) {
        try {
            postService.updateComment(postId, commentId, comment).get();
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error updating comment", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String postId, @PathVariable String commentId) {
        try {
            postService.deleteComment(postId, commentId).get();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (InterruptedException | ExecutionException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}