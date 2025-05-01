package com.cakecrafters.backend.service;

import com.cakecrafters.backend.model.UserProject;
import com.google.firebase.database.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class UserProjectService {

    private final DatabaseReference databaseReference;

    public UserProjectService() {
        this.databaseReference = FirebaseDatabase.getInstance().getReference("userProjects");
    }

    public CompletableFuture<UserProject> createUserProject(UserProject userProject) {
        CompletableFuture<UserProject> future = new CompletableFuture<>();
        String key = databaseReference.push().getKey();
        userProject.setId(key);
        databaseReference.child(key).setValue(userProject, (error, ref) -> {
            if (error == null) {
                future.complete(userProject);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<UserProject> getUserProject(String id) {
        CompletableFuture<UserProject> future = new CompletableFuture<>();
        databaseReference.child(id).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                UserProject project = snapshot.getValue(UserProject.class);
                if (project != null) {
                    project.setId(id);
                    future.complete(project);
                } else {
                    future.completeExceptionally(new RuntimeException("Project not found"));
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<List<UserProject>> getAllUserProjects() {
        CompletableFuture<List<UserProject>> future = new CompletableFuture<>();
        databaseReference.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                List<UserProject> projects = new ArrayList<>();
                for (DataSnapshot data : snapshot.getChildren()) {
                    UserProject project = data.getValue(UserProject.class);
                    if (project != null) {
                        project.setId(data.getKey());
                        projects.add(project);
                    }
                }
                future.complete(projects);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<UserProject> updateUserProject(String id, UserProject userProject) {
        CompletableFuture<UserProject> future = new CompletableFuture<>();
        userProject.setId(id);
        databaseReference.child(id).setValue(userProject, (error, ref) -> {
            if (error == null) {
                future.complete(userProject);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<Void> deleteUserProject(String id) {
        CompletableFuture<Void> future = new CompletableFuture<>();
        databaseReference.child(id).removeValue((error, ref) -> {
            if (error == null) {
                future.complete(null);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<UserProject> addProgressUpdate(String id, String progressUpdate) {
        CompletableFuture<UserProject> future = new CompletableFuture<>();
        databaseReference.child(id).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                UserProject project = snapshot.getValue(UserProject.class);
                if (project != null) {
                    project.setId(id);
                    List<String> updates = project.getProgressUpdates();
                    if (updates == null) {
                        updates = new ArrayList<>();
                    }
                    // Ensure the progressUpdate is stored as a plain string
                    updates.add(progressUpdate);
                    project.setProgressUpdates(updates);
                    databaseReference.child(id).setValue(project, (error, ref) -> {
                        if (error == null) {
                            future.complete(project);
                        } else {
                            future.completeExceptionally(new RuntimeException(error.getMessage()));
                        }
                    });
                } else {
                    future.completeExceptionally(new RuntimeException("Project not found"));
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }
}