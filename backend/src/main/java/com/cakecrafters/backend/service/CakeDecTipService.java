package com.cakecrafters.backend.service;

import com.cakecrafters.backend.model.CakeDecTip;
import com.google.firebase.database.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class CakeDecTipService {

    private final DatabaseReference databaseReference;

    public CakeDecTipService() {
        this.databaseReference = FirebaseDatabase.getInstance().getReference("decorationTips");
    }

    public CompletableFuture<CakeDecTip> createTip(CakeDecTip tip) {
        CompletableFuture<CakeDecTip> future = new CompletableFuture<>();
        String key = databaseReference.push().getKey();
        tip.setId(key);
        databaseReference.child(key).setValue(tip, (error, ref) -> {
            if (error == null) {
                future.complete(tip);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<CakeDecTip> getTip(String id) {
        CompletableFuture<CakeDecTip> future = new CompletableFuture<>();
        databaseReference.child(id).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                CakeDecTip tip = snapshot.getValue(CakeDecTip.class);
                if (tip != null) {
                    tip.setId(id);
                    future.complete(tip);
                } else {
                    future.completeExceptionally(new RuntimeException("Tip not found"));
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<List<CakeDecTip>> getAllTips() {
        CompletableFuture<List<CakeDecTip>> future = new CompletableFuture<>();
        databaseReference.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                List<CakeDecTip> tips = new ArrayList<>();
                for (DataSnapshot data : snapshot.getChildren()) {
                    CakeDecTip tip = data.getValue(CakeDecTip.class);
                    if (tip != null) {
                        tip.setId(data.getKey());
                        tips.add(tip);
                    }
                }
                future.complete(tips);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<CakeDecTip> updateTip(String id, CakeDecTip tip) {
        CompletableFuture<CakeDecTip> future = new CompletableFuture<>();
        tip.setId(id);
        databaseReference.child(id).setValue(tip, (error, ref) -> {
            if (error == null) {
                future.complete(tip);
            } else {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<Void> deleteTip(String id) {
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

    public CompletableFuture<CakeDecTip> likeTip(String id) {
        CompletableFuture<CakeDecTip> future = new CompletableFuture<>();
        databaseReference.child(id).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                CakeDecTip tip = snapshot.getValue(CakeDecTip.class);
                if (tip != null) {
                    tip.setId(id);
                    tip.setLikes(tip.getLikes() + 1);
                    databaseReference.child(id).setValue(tip, (error, ref) -> {
                        if (error == null) {
                            future.complete(tip);
                        } else {
                            future.completeExceptionally(new RuntimeException(error.getMessage()));
                        }
                    });
                } else {
                    future.completeExceptionally(new RuntimeException("Tip not found"));
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<CakeDecTip> addComment(String id, CakeDecTip.Comment comment) {
        CompletableFuture<CakeDecTip> future = new CompletableFuture<>();
        databaseReference.child(id).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                CakeDecTip tip = snapshot.getValue(CakeDecTip.class);
                if (tip != null) {
                    tip.setId(id);
                    List<CakeDecTip.Comment> comments = tip.getComments();
                    if (comments == null) {
                        comments = new ArrayList<>();
                    }
                    comment.setId(String.valueOf(System.currentTimeMillis()));
                    comments.add(comment);
                    tip.setComments(comments);
                    databaseReference.child(id).setValue(tip, (error, ref) -> {
                        if (error == null) {
                            future.complete(tip);
                        } else {
                            future.completeExceptionally(new RuntimeException(error.getMessage()));
                        }
                    });
                } else {
                    future.completeExceptionally(new RuntimeException("Tip not found"));
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException(error.getMessage()));
            }
        });
        return future;
    }

    public CompletableFuture<CakeDecTip> deleteComment(String tipId, String commentId) {
        CompletableFuture<CakeDecTip> future = new CompletableFuture<>();
        databaseReference.child(tipId).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                CakeDecTip tip = snapshot.getValue(CakeDecTip.class);
                if (tip != null) {
                    tip.setId(tipId);
                    List<CakeDecTip.Comment> comments = tip.getComments();
                    if (comments != null) {
                        comments.removeIf(comment -> comment.getId().equals(commentId));
                        tip.setComments(comments);
                        databaseReference.child(tipId).setValue(tip, (error, ref) -> {
                            if (error == null) {
                                future.complete(tip);
                            } else {
                                future.completeExceptionally(new RuntimeException(error.getMessage()));
                            }
                        });
                    } else {
                        future.complete(tip);
                    }
                } else {
                    future.completeExceptionally(new RuntimeException("Tip not found"));
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