package com.larsobist.culino.models;

import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@NoArgsConstructor
@Document(collection = "recipes")
public class Recipe {
    @Id
    private String id;
    private boolean published;
    private String author;
    private String title;
    private String description;
    private String fileName;
    private String difficulty;
    private String duration;
    private String price;
    private Object ingredients;
    private List<String> steps;
    private List<String> tags;

    // Constructor for initializing the Recipe object
    public Recipe(boolean published, String author, String title, String description, String fileName, String difficulty, String duration, String price, Object ingredients, List<String> steps, List<String> tags) {
        this.author = author;
        this.published = published;
        this.title = title;
        this.description = description;
        this.fileName = fileName;
        this.difficulty = difficulty;
        this.duration = duration;
        this.price = price;
        this.ingredients = ingredients;
        this.steps = steps;
        this.tags = tags;
    }

    // Getter for the id field
    public String getId() {
        return id;
    }

    // Getter for the published field
    public boolean isPublished() {
        return published;
    }

    // Setter for the published field
    public void setPublished(boolean published) {
        this.published = published;
    }

    // Getter for the author field
    public String getAuthor() {
        return author;
    }

    // Setter for the author field
    public void setAuthor(String author) {
        this.author = author;
    }

    // Getter for the title field
    public String getTitle() {
        return title;
    }

    // Setter for the title field
    public void setTitle(String title) {
        this.title = title;
    }

    // Getter for the description field
    public String getDescription() {
        return description;
    }

    // Setter for the description field
    public void setDescription(String description) {
        this.description = description;
    }

    // Getter for the fileName field
    public String getFileName() {
        return fileName;
    }

    // Setter for the fileName field
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    // Getter for the difficulty field
    public String getDifficulty() {
        return difficulty;
    }

    // Setter for the difficulty field
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    // Getter for the duration field
    public String getDuration() {
        return duration;
    }

    // Setter for the duration field
    public void setDuration(String duration) {
        this.duration = duration;
    }

    // Getter for the price field
    public String getPrice() {
        return price;
    }

    // Setter for the price field
    public void setPrice(String price) {
        this.price = price;
    }

    // Getter for the ingredients field
    public Object getIngredients() {
        return ingredients;
    }

    // Setter for the ingredients field
    public void setIngredients(Object ingredients) {
        this.ingredients = ingredients;
    }

    // Getter for the steps field
    public List<String> getSteps() {
        return steps;
    }

    // Setter for the steps field
    public void setSteps(List<String> steps) {
        this.steps = steps;
    }

    // Getter for the tags field
    public List<String> getTags() {
        return tags;
    }

    // Setter for the tags field
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    // Overriding the toString() method to provide a string representation of the Recipe object
    @Override
    public String toString() {
        return "Recipe [id=" + id + ", published=" + published + ", author=" + author + ", title=" + title + ", description=" + description + ", fileName=" + fileName + ", difficulty=" + difficulty + ", duration=" + duration + ", ingredients=" + ingredients + ", steps=" + steps + ", tags=" + tags + "]";
    }
}
