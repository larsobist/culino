package com.larsobist.culino.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
    private String token;                 // Access token for authentication
    private String type = "Bearer";       // Token type
    private String id;                    // User ID
    private String username;              // Username
    private String email;                 // Email
    private List<String> roles;           // List of roles associated with the user

    public JwtResponse(String accessToken, String id, String username, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}
