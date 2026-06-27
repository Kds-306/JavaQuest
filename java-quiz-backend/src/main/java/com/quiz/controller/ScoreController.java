package com.quiz.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quiz.entity.Score;
import com.quiz.repository.ScoreRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/score")
public class ScoreController {

    @Autowired
    private ScoreRepository repo;

    @PostMapping
    public ResponseEntity<?> saveScore(@RequestBody Score score) {
        if (score.getPlayerName() == null || score.getPlayerName().isBlank()) {
            return ResponseEntity.badRequest().body("playerName is required");
        }
        if (score.getLevel() == null || score.getLevel().isBlank()) {
            return ResponseEntity.badRequest().body("level is required");
        }
        if (score.getScore() < 0) {
            return ResponseEntity.badRequest().body("score must be non-negative");
        }
        Score saved = repo.save(score);
        return ResponseEntity.ok(saved);
    }

    
    @GetMapping("/scores")
    public List<Score> getScores(@RequestParam(required = false) String level) {
        if (level != null && !level.isBlank()) {
            return repo.findByLevelOrderByScoreDesc(level);
        }
        return repo.findAllByOrderByScoreDesc();
    }

    
    @GetMapping("/test")
    public String test() {
        return "JavaQuest backend is running ✅";
    }
}