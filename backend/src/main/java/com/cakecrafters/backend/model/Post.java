package com.cakecrafters.backend.model;

import java.util.List;
import java.util.Map;

public class Post {
    private String postId;
    private String description;
    private List<String> mediaUrls;
    private String ownerId;
    private int likesCount;
    private Map<String, Comment> comments;

    public Post() {}

    public Post(String description, List<String> mediaUrls, String ownerId) {
        this.description = description;
        this.mediaUrls = mediaUrls;
        this.ownerId = ownerId;
        this.likesCount = 0;
    }

    // Getters and setters
    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public int getLikesCount() { return likesCount; }
    public void setLikesCount(int likesCount) { this.likesCount = likesCount; }
    public Map<String, Comment> getComments() { return comments; }
    public void setComments(Map<String, Comment> comments) { this.comments = comments; }

    @Override
    public String toString() {
        return "Post{postId='" + postId + "', description='" + description + "', mediaUrls=" + mediaUrls + "}";
    }
}