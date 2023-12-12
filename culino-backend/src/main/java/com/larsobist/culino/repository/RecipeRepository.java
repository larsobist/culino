package com.larsobist.culino.repository;

import com.larsobist.culino.models.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

// Repository interface for performing CRUD operations on Recipe entities
public interface RecipeRepository extends MongoRepository<Recipe, String> {

    // Custom query method to find recipes by title containing a specific string
    List<Recipe> findByTitleContaining(String title);

    // Custom query method to find recipes by published status
    List<Recipe> findByPublished(boolean published);
}