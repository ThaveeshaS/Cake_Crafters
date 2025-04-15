package com.cakecrafters.backend.service;

import com.cakecrafters.backend.model.CakeRecipe;
import com.google.firebase.database.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class CakeRecipeService {

    private final DatabaseReference databaseReference;

    public CakeRecipeService() {
        this.databaseReference = FirebaseDatabase.getInstance().getReference("cakeRecipes");
    }

    // Create a new cake recipe
    public CompletableFuture<CakeRecipe> createCakeRecipe(CakeRecipe cakeRecipe) {
        CompletableFuture<CakeRecipe> future = new CompletableFuture<>();
        String key = databaseReference.push().getKey();
        cakeRecipe.setId(key);
        databaseReference.child(key).setValue(cakeRecipe, (error, ref) -> {
            if (error == null) {
                future.complete(cakeRecipe);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    // Get a cake recipe by ID
    public CompletableFuture<CakeRecipe> getCakeRecipe(String id) {
        CompletableFuture<CakeRecipe> future = new CompletableFuture<>();
        databaseReference.child(id).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                CakeRecipe recipe = snapshot.getValue(CakeRecipe.class);
                if (recipe != null) {
                    recipe.setId(id);
                    future.complete(recipe);
                } else {
                    future.completeExceptionally(new RuntimeException("Recipe not found"));
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    // Get all cake recipes
    public CompletableFuture<List<CakeRecipe>> getAllCakeRecipes() {
        CompletableFuture<List<CakeRecipe>> future = new CompletableFuture<>();
        databaseReference.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                List<CakeRecipe> recipes = new ArrayList<>();
                for (DataSnapshot data : snapshot.getChildren()) {
                    CakeRecipe recipe = data.getValue(CakeRecipe.class);
                    if (recipe != null) {
                        recipe.setId(data.getKey());
                        recipes.add(recipe);
                    }
                }
                future.complete(recipes);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    // Update a cake recipe
    public CompletableFuture<CakeRecipe> updateCakeRecipe(String id, CakeRecipe cakeRecipe) {
        CompletableFuture<CakeRecipe> future = new CompletableFuture<>();
        cakeRecipe.setId(id);
        databaseReference.child(id).setValue(cakeRecipe, (error, ref) -> {
            if (error == null) {
                future.complete(cakeRecipe);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    // Delete a cake recipe
    public CompletableFuture<Void> deleteCakeRecipe(String id) {
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
}