package com.quiz.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String playerName;
    private String level;
    private int score;

    // ✅ GETTERS
    public Long getId() {
        return id;
    }

    public String getPlayerName() {
        return playerName;
    }

    public String getLevel() {
        return level;
    }

    public int getScore() {
        return score;
    }

    // ✅ SETTERS
    public void setId(Long id) {
        this.id = id;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
