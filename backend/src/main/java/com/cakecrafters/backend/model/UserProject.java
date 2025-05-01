package com.cakecrafters.backend.model;

import java.util.ArrayList;
import java.util.List;

public class UserProject {
    private String id;
    private String userId;
    private String title;
    private String description;
    private List<String> progressUpdates; // Stores Base64 strings for images/videos or text
    private String date;

    public UserProject() {
        this.progressUpdates = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getProgressUpdates() {
        return progressUpdates;
    }

    public void setProgressUpdates(List<String> progressUpdates) {
        this.progressUpdates = progressUpdates;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}