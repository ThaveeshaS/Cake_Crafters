package com.cakecrafters.backend.controller;

import com.cakecrafters.backend.model.UserProject;
import com.cakecrafters.backend.service.UserProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/user-projects")
public class UserProjectController {

    private final UserProjectService userProjectService;

    @Autowired
    public UserProjectController(UserProjectService userProjectService) {
        this.userProjectService = userProjectService;
    }

    @PostMapping
    public CompletableFuture<ResponseEntity<UserProject>> createUserProject(@RequestBody UserProject userProject) {
        return userProjectService.createUserProject(userProject)
                .thenApply(project -> ResponseEntity.ok(project))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<UserProject>> getUserProject(@PathVariable String id) {
        return userProjectService.getUserProject(id)
                .thenApply(project -> ResponseEntity.ok(project))
                .exceptionally(throwable -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public CompletableFuture<ResponseEntity<List<UserProject>>> getAllUserProjects() {
        return userProjectService.getAllUserProjects()
                .thenApply(projects -> ResponseEntity.ok(projects))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<UserProject>> updateUserProject(@PathVariable String id, @RequestBody UserProject userProject) {
        return userProjectService.updateUserProject(id, userProject)
                .thenApply(project -> ResponseEntity.ok(project))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> deleteUserProject(@PathVariable String id) {
        return userProjectService.deleteUserProject(id)
                .thenApply(aVoid -> ResponseEntity.ok().<Void>build())
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @PostMapping("/{id}/progress")
    public CompletableFuture<ResponseEntity<UserProject>> addProgressUpdate(@PathVariable String id, @RequestBody String progressUpdate) {
        return userProjectService.addProgressUpdate(id, progressUpdate)
                .thenApply(project -> ResponseEntity.ok(project))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }
}