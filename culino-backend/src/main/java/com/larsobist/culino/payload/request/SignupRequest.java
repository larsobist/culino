package com.larsobist.culino.payload.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class SignupRequest {
    private String username;        // Username provided in the signup request
    private String email;           // Email provided in the signup request
    private Set<String> roles;      // Set of roles assigned to the user
    private String password;        // Password provided in the signup request
}
