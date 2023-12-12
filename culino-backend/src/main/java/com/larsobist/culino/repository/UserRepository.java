package com.larsobist.culino.repository;

import com.larsobist.culino.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

// Repository interface for performing CRUD operations on User entities
public interface UserRepository extends MongoRepository<User, String> {

    // Custom query method to find a user by username
    Optional<User> findByUsername(String username);

    // Custom query method to check if a user with a specific username exists
    Boolean existsByUsername(String username);

    // Custom query method to check if a user with a specific email exists
    Boolean existsByEmail(String email);
}
