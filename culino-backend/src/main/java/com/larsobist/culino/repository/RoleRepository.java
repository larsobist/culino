package com.larsobist.culino.repository;

import com.larsobist.culino.models.ERole;
import com.larsobist.culino.models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

// Repository interface for performing CRUD operations on Role entities
public interface RoleRepository extends MongoRepository<Role, String> {

    // Custom query method to find a role by name
    Optional<Role> findByName(ERole name);
}
