package com.quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.quiz.entity.Score;
import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, Long> {

    // Returns all scores sorted by score descending — highest first
    List<Score> findAllByOrderByScoreDesc();

    // Useful for per-level leaderboard
    List<Score> findByLevelOrderByScoreDesc(String level);
}