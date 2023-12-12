package com.larsobist.culino;

import com.larsobist.culino.service.FilesStorageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.Resource;

@SpringBootApplication
public class CulinoApplication implements CommandLineRunner {
    @Resource
    FilesStorageService storageService;

    public static void main(String[] args) {
        SpringApplication.run(CulinoApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize the files storage service
        storageService.init();
    }
}
