package com.larsobist.culino.service;

import java.nio.file.Path;
import java.util.stream.Stream;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FilesStorageService {
    // Initialize the service
    public void init();

    // Save a file
    public void save(MultipartFile file);

    // Load a file
    public Resource load(String filename);

    // Delete a file
    public boolean delete(String filename);

    // Load all files
    public Stream<Path> loadAll();
}
