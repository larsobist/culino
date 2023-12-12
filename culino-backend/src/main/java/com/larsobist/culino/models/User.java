package com.larsobist.culino.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String userId;

    private String username;  // Username of the user
    private String email;     // Email of the user
    private String password;  // Password of the user

    @DBRef
    private Set<Role> roles = new HashSet<>();  // Set of roles associated with the user

    // Constructor for initializing the User object with a username, email, and password
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
