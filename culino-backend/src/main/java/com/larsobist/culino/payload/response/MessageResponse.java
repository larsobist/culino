package com.larsobist.culino.payload.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageResponse {
    private String message;  // Message to be sent in the response

    public MessageResponse(String message) {
        this.message = message;
    }

    // Getter for the message field
    public String getMessage() {
        return message;
    }

    // Setter for the message field
    public void setMessage(String message) {
        this.message = message;
    }
}
