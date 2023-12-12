package com.larsobist.culino.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String username;  // Username provided in the login request
    private String password;  // Password provided in the login request
}
