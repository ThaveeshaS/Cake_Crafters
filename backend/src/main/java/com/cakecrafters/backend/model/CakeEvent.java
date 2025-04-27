package com.cakecrafters.backend.model;

public class CakeEvent {
    private String id;
    private String eventType;
    private String description;
    private String cakeType;
    private String photoUrl;

    // Default constructor (required for Firebase deserialization)
    public CakeEvent() {
    }

    public CakeEvent(String eventType, String description, String cakeType, String photoUrl) {
        this.eventType = eventType;
        this.description = description;
        this.cakeType = cakeType;
        this.photoUrl = photoUrl;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCakeType() {
        return cakeType;
    }

    public void setCakeType(String cakeType) {
        this.cakeType = cakeType;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}