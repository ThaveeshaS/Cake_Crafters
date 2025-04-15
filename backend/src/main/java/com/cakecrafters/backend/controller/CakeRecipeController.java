package com.cakecrafters.backend.controller;

import com.cakecrafters.backend.model.CakeRecipe;
import com.cakecrafters.backend.service.CakeRecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/cake-recipes")
public class CakeRecipeController {

    private final CakeRecipeService cakeRecipeService;

    @Autowired
    public CakeRecipeController(CakeRecipeService cakeRecipeService) {
        this.cakeRecipeService = cakeRecipeService;
    }

    @PostMapping
    public CompletableFuture<ResponseEntity<CakeRecipe>> createCakeRecipe(@RequestBody CakeRecipe cakeRecipe) {
        return cakeRecipeService.createCakeRecipe(cakeRecipe)
                .thenApply(recipe -> ResponseEntity.ok(recipe))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<CakeRecipe>> getCakeRecipe(@PathVariable String id) {
        return cakeRecipeService.getCakeRecipe(id)
                .thenApply(recipe -> ResponseEntity.ok(recipe))
                .exceptionally(throwable -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public CompletableFuture<ResponseEntity<List<CakeRecipe>>> getAllCakeRecipes() {
        return cakeRecipeService.getAllCakeRecipes()
                .thenApply(recipes -> ResponseEntity.ok(recipes))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<CakeRecipe>> updateCakeRecipe(@PathVariable String id, @RequestBody CakeRecipe cakeRecipe) {
        return cakeRecipeService.updateCakeRecipe(id, cakeRecipe)
                .thenApply(recipe -> ResponseEntity.ok(recipe))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> deleteCakeRecipe(@PathVariable String id) {
        return cakeRecipeService.deleteCakeRecipe(id)
                .thenApply(aVoid -> ResponseEntity.ok().<Void>build())
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @PostMapping("/{id}/like")
    public CompletableFuture<ResponseEntity<CakeRecipe>> likeCakeRecipe(@PathVariable String id) {
        return cakeRecipeService.likeCakeRecipe(id)
                .thenApply(recipe -> ResponseEntity.ok(recipe))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }

    @PostMapping("/{id}/comment")
    public CompletableFuture<ResponseEntity<CakeRecipe>> addComment(@PathVariable String id, @RequestBody String comment) {
        return cakeRecipeService.addComment(id, comment)
                .thenApply(recipe -> ResponseEntity.ok(recipe))
                .exceptionally(throwable -> ResponseEntity.badRequest().build());
    }
}