package com.larsobist.culino.models;

import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@NoArgsConstructor
@Document(collection = "roles")
public class Role {
    @Id
    private String id;

    private ERole name;

    // Constructor for initializing the Role object with a name
    public Role(ERole name) {
        this.name = name;
    }

    // Getter for the id field
    public String getId() {
        return id;
    }

    // Setter for the id field
    public void setId(String id) {
        this.id = id;
    }

    // Getter for the name field
    public ERole getName() {
        return name;
    }

    // Setter for the name field
    public void setName(ERole name) {
        this.name = name;
    }
}
