package com.larsobist.culino.models;

// Model class to represent file information
public class FileInfo {
    private String name;  // Name of the file
    private String url;   // URL or location of the file

    // Constructor to initialize the FileInfo object with name and URL
    public FileInfo(String name, String url) {
        this.name = name;
        this.url = url;
    }

    // Getter for the name field
    public String getName() {
        return this.name;
    }

    // Setter for the name field
    public void setName(String name) {
        this.name = name;
    }

    // Getter for the url field
    public String getUrl() {
        return this.url;
    }

    // Setter for the url field
    public void setUrl(String url) {
        this.url = url;
    }
}
