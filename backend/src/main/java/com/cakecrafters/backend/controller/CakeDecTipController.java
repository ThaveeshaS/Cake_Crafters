package com.cakecrafters.backend.controller;

import com.cakecrafters.backend.model.CakeDecTip;
import com.cakecrafters.backend.service.CakeDecTipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/decoration-tips")
public class CakeDecTipController {

    private final CakeDecTipService tipService;

    @Autowired
    public CakeDecTipController(CakeDecTipService tipService) {
        this.tipService = tipService;
    }

    @PostMapping
    public CompletableFuture<ResponseEntity<CakeDecTip>> createTip(@RequestBody CakeDecTip tip) {
        return tipService.createTip(tip)
                .thenApply(t -> ResponseEntity.ok(t))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<CakeDecTip>> getTip(@PathVariable String id) {
        return tipService.getTip(id)
                .thenApply(t -> ResponseEntity.ok(t))
                .exceptionally(throwable -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public CompletableFuture<ResponseEntity<List<CakeDecTip>>> getAllTips() {
        return tipService.getAllTips()
                .thenApply(tips -> ResponseEntity.ok(tips))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<CakeDecTip>> updateTip(@PathVariable String id, @RequestBody CakeDecTip tip) {
        return tipService.updateTip(id, tip)
                .thenApply(t -> ResponseEntity.ok(t))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> deleteTip(@PathVariable String id) {
        return tipService.deleteTip(id)
                .thenApply(aVoid -> ResponseEntity.ok().<Void>build())
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @PostMapping("/{id}/like")
    public CompletableFuture<ResponseEntity<CakeDecTip>> likeTip(@PathVariable String id) {
        return tipService.likeTip(id)
                .thenApply(t -> ResponseEntity.ok(t))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @PostMapping("/{id}/comment")
    public CompletableFuture<ResponseEntity<CakeDecTip>> addComment(@PathVariable String id, @RequestBody CakeDecTip.Comment comment) {
        return tipService.addComment(id, comment)
                .thenApply(t -> ResponseEntity.ok(t))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{id}/comment/{commentId}")
    public CompletableFuture<ResponseEntity<CakeDecTip>> deleteComment(@PathVariable String id, @PathVariable String commentId) {
        return tipService.deleteComment(id, commentId)
                .thenApply(t -> ResponseEntity.ok(t))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }
}