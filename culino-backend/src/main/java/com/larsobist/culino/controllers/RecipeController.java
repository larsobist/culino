package com.larsobist.culino.controllers;

import com.larsobist.culino.models.Recipe;
import com.larsobist.culino.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class RecipeController {

    @Autowired
    RecipeRepository recipeRepository;

    // Get all recipes (optionally filtered by title)
    @GetMapping("/recipes")
    public ResponseEntity<List<Recipe>> getAllRecipes(@RequestParam(required = false) String title) {
        try {
            List<Recipe> recipes = new ArrayList<Recipe>();

            if (title == null)
                recipeRepository.findAll().forEach(recipes::add);
            else
                recipeRepository.findByTitleContaining(title).forEach(recipes::add);

            if (recipes.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(recipes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get a recipe by ID
    @GetMapping("/recipes/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable("id") String id) {
        Optional<Recipe> recipeData = recipeRepository.findById(id);

        if (recipeData.isPresent()) {
            return new ResponseEntity<>(recipeData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Create a new recipe
    @PostMapping("/recipes")
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) {
        try {
            Recipe _recipe = recipeRepository.save(new Recipe( false, recipe.getAuthor(),recipe.getTitle(), recipe.getDescription(), recipe.getFileName(), recipe.getDifficulty(),recipe.getDuration(), recipe.getPrice(),  recipe.getIngredients(), recipe.getSteps(), recipe.getTags()));
            return new ResponseEntity<>(_recipe, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update a recipe by ID
    @PutMapping("/recipes/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable("id") String id, @RequestBody Recipe recipe) {
        Optional<Recipe> recipeData = recipeRepository.findById(id);

        if (recipeData.isPresent()) {
            Recipe _recipe = recipeData.get();
            _recipe.setPublished(recipe.isPublished());
            _recipe.setAuthor(recipe.getAuthor());
            _recipe.setTitle(recipe.getTitle());
            _recipe.setDescription(recipe.getDescription());
            _recipe.setFileName(recipe.getFileName());
            _recipe.setDifficulty(recipe.getDifficulty());
            _recipe.setDuration(recipe.getDuration());
            _recipe.setPrice(recipe.getPrice());
            _recipe.setIngredients(recipe.getIngredients());
            _recipe.setSteps(recipe.getSteps());
            _recipe.setTags(recipe.getTags());
            return new ResponseEntity<>(recipeRepository.save(_recipe), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a recipe by ID
    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<HttpStatus> deleteRecipe(@PathVariable("id") String id) {
        try {
            recipeRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete all recipes
    @DeleteMapping("/recipes")
    public ResponseEntity<HttpStatus> deleteAllRecipes() {
        try {
            recipeRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all published recipes
    @GetMapping("/recipes/published")
    public ResponseEntity<List<Recipe>> findByPublished() {
        try {
            List<Recipe> recipes = recipeRepository.findByPublished(true);

            if (recipes.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(recipes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
