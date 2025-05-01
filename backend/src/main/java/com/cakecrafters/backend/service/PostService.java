package com.cakecrafters.backend.service;

import com.google.firebase.database.*;
import com.cakecrafters.backend.model.Comment;
import com.cakecrafters.backend.model.Post;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class PostService {

    private final DatabaseReference database;

    public PostService() {
        database = FirebaseDatabase.getInstance().getReference();
    }

    public CompletableFuture<String> createPost(Post post) {
        CompletableFuture<String> future = new CompletableFuture<>();
        String postId = database.child("posts").push().getKey();
        post.setPostId(postId);
        database.child("posts").child(postId).setValue(post, (error, ref) -> {
            if (error == null) {
                future.complete(postId);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<List<Post>> getAllPosts() {
        CompletableFuture<List<Post>> future = new CompletableFuture<>();
        database.child("posts").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                List<Post> posts = new ArrayList<>();
                for (DataSnapshot postSnapshot : snapshot.getChildren()) {
                    Post post = postSnapshot.getValue(Post.class);
                    if (post != null) {
                        post.setPostId(postSnapshot.getKey());
                        posts.add(post);
                    }
                }
                future.complete(posts);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<Void> updatePost(String postId, Post post) {
        CompletableFuture<Void> future = new CompletableFuture<>();
        database.child("posts").child(postId).setValue(post, (error, ref) -> {
            if (error == null) {
                future.complete(null);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<Void> deletePost(String postId) {
        CompletableFuture<Void> future = new CompletableFuture<>();
        database.child("posts").child(postId).removeValue((error, ref) -> {
            if (error == null) {
                future.complete(null);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<Void> likePost(String postId) {
        CompletableFuture<Void> future = new CompletableFuture<>();
        database.child("posts").child(postId).child("likesCount").runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData currentData) {
                Integer count = currentData.getValue(Integer.class);
                if (count == null) {
                    count = 0;
                }
                currentData.setValue(count + 1);
                return Transaction.success(currentData);
            }

            @Override
            public void onComplete(DatabaseError error, boolean committed, DataSnapshot currentData) {
                if (error == null && committed) {
                    future.complete(null);
                } else {
                    future.completeExceptionally(new RuntimeException(error != null ? error.getMessage() : "Transaction failed"));
                }
            }
        });
        return future;
    }

    public CompletableFuture<Void> dislikePost(String postId) {
        CompletableFuture<Void> future = new CompletableFuture<>();
        database.child("posts").child(postId).child("dislikesCount").runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData currentData) {
                Integer count = currentData.getValue(Integer.class);
                if (count == null) {
                    count = 0;
                }
                currentData.setValue(count + 1);
                return Transaction.success(currentData);
            }

            @Override
            public void onComplete(DatabaseError error, boolean committed, DataSnapshot currentData) {
                if (error == null && committed) {
                    future.complete(null);
                } else {
                    future.completeExceptionally(new RuntimeException(error != null ? error.getMessage() : "Transaction failed"));
                }
            }
        });
        return future;
    }

    public CompletableFuture<String> addComment(String postId, Comment comment) {
        CompletableFuture<String> future = new CompletableFuture<>();
        String commentId = database.child("posts").child(postId).child("comments").push().getKey();
        comment.setCommentId(commentId);
        comment.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        database.child("posts").child(postId).child("comments").child(commentId).setValue(comment, (error, ref) -> {
            if (error == null) {
                future.complete(commentId);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<Void> updateComment(String postId, String commentId, Comment comment) {
        CompletableFuture<Void> future = new CompletableFuture<>();
        comment.setCommentId(commentId);
        comment.setPostId(postId);
        comment.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        database.child("posts").child(postId).child("comments").child(commentId).setValue(comment, (error, ref) -> {
            if (error == null) {
                future.complete(null);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<Void> deleteComment(String postId, String commentId) {
        CompletableFuture<Void> future = new CompletableFuture<>();
        database.child("posts").child(postId).child("comments").child(commentId).removeValue((error, ref) -> {
            if (error == null) {
                future.complete(null);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }
}