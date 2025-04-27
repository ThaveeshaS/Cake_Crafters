package com.cakecrafters.backend.controller;

import com.cakecrafters.backend.model.CakeEvent;
import com.cakecrafters.backend.service.CakeEventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/cake-events")
public class CakeEventController {

    private static final Logger logger = LoggerFactory.getLogger(CakeEventController.class);

    @Autowired
    private CakeEventService cakeEventService;

    public CakeEventController() {
        logger.info("CakeEventController initialized");
    }

    @PostMapping
    public ResponseEntity<String> createCakeEvent(
            @RequestParam("eventType") String eventType,
            @RequestParam("description") String description,
            @RequestParam("cakeType") String cakeType,
            @RequestParam(value = "photo", required = false) MultipartFile photo) throws IOException, ExecutionException, InterruptedException {

        logger.info("Received POST request to /api/cake-events with eventType: {}", eventType);
        CakeEvent cakeEvent = new CakeEvent(eventType, description, cakeType, null);
        String id = cakeEventService.saveCakeEvent(cakeEvent, photo).get();

        return ResponseEntity.ok(id);
    }

    @GetMapping
    public ResponseEntity<List<CakeEvent>> getAllCakeEvents() throws ExecutionException, InterruptedException {
        List<CakeEvent> cakeEvents = cakeEventService.getAllCakeEvents().get();
        return ResponseEntity.ok(cakeEvents);
    }

    @GetMapping("/test-cors")
    public ResponseEntity<String> testCors() {
        return ResponseEntity.ok("CORS test successful!");
    }
}

