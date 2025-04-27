package com.cakecrafters.backend.service;

import com.cakecrafters.backend.model.CakeEvent;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.database.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class CakeEventService {

    private final FirebaseDatabase database;
    private final Bucket firebaseStorage;

    public CakeEventService() {
        this.database = FirebaseDatabase.getInstance();
        this.firebaseStorage = com.google.cloud.storage.StorageOptions.getDefaultInstance()
                .getService()
                .get("cakecrafters-3f214.appspot.com");
    }

    public CompletableFuture<String> saveCakeEvent(CakeEvent cakeEvent, MultipartFile photo) throws IOException {
        CompletableFuture<String> future = new CompletableFuture<>();

        // Upload photo to Firebase Storage if provided
        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            String fileName = "cake_events/" + System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            Blob blob = firebaseStorage.create(fileName, photo.getInputStream(), photo.getContentType());
            photoUrl = blob.getMediaLink();
            cakeEvent.setPhotoUrl(photoUrl);
        }

        // Save cake event to Firebase Realtime Database
        DatabaseReference ref = database.getReference("cake_events");
        String id = ref.push().getKey();
        cakeEvent.setId(id);

        ref.child(id).setValue(cakeEvent, (databaseError, databaseReference) -> {
            if (databaseError != null) {
                future.completeExceptionally(new RuntimeException("Failed to save cake event: " + databaseError.getMessage()));
            } else {
                future.complete(id);
            }
        });

        return future;
    }

    public CompletableFuture<List<CakeEvent>> getAllCakeEvents() {
        CompletableFuture<List<CakeEvent>> future = new CompletableFuture<>();
        DatabaseReference ref = database.getReference("cake_events");

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                List<CakeEvent> cakeEvents = new ArrayList<>();
                for (DataSnapshot dataSnapshot : snapshot.getChildren()) {
                    CakeEvent cakeEvent = dataSnapshot.getValue(CakeEvent.class);
                    if (cakeEvent != null) {
                        cakeEvent.setId(dataSnapshot.getKey());
                        cakeEvents.add(cakeEvent);
                    }
                }
                future.complete(cakeEvents);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException("Failed to fetch cake events: " + error.getMessage()));
            }
        });

        return future;
    }
}