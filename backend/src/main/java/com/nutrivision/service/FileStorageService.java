package com.nutrivision.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.*;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
    );

    private final Path rootUploadPath;

    public FileStorageService(@Value("${app.storage.upload-dir:./uploads/assessments}") String uploadDir) {
        this.rootUploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootUploadPath);
            log.info("Initialized root upload directory: {}", this.rootUploadPath);
        } catch (IOException e) {
            log.error("Failed to create root upload directory: {}", this.rootUploadPath, e);
            throw new RuntimeException("Could not initialize upload storage location", e);
        }
    }

    /**
     * Validates and saves an uploaded image file under uploads/assessments/{assessmentId}/
     * Returns the relative storage path.
     */
    public StoredFileInfo storeAssessmentImage(Long assessmentId, MultipartFile file) {
        validateFile(file);

        String originalFilename = Optional.ofNullable(file.getOriginalFilename())
                .map(Paths::get)
                .map(Path::getFileName)
                .map(Path::toString)
                .orElse("image.jpg");

        String extension = getFileExtension(originalFilename);
        String uniqueFilename = String.format("assessment_%d_%s.%s",
                assessmentId,
                UUID.randomUUID(),
                extension
        );

        Path assessmentDir = this.rootUploadPath.resolve(String.valueOf(assessmentId)).normalize();

        // Prevent path traversal
        if (!assessmentDir.startsWith(this.rootUploadPath)) {
            throw new IllegalArgumentException("Invalid directory path (Path traversal detected)");
        }

        try {
            Files.createDirectories(assessmentDir);
            Path destinationFile = assessmentDir.resolve(uniqueFilename).normalize();

            if (!destinationFile.startsWith(assessmentDir)) {
                throw new IllegalArgumentException("Cannot store file outside current assessment directory");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            log.info("Stored assessment image for assessment #{}: {}", assessmentId, destinationFile);

            // Relative path for database storage
            String relativePath = Paths.get(String.valueOf(assessmentId), uniqueFilename).toString().replace('\\', '/');

            return new StoredFileInfo(
                    originalFilename,
                    uniqueFilename,
                    relativePath,
                    file.getContentType(),
                    (int) file.getSize()
            );

        } catch (IOException e) {
            log.error("Failed to store file for assessment #{}", assessmentId, e);
            throw new RuntimeException("Failed to store uploaded file: " + e.getMessage(), e);
        }
    }

    /**
     * Validates file size, extension, MIME type, and magic header bytes.
     */
    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file cannot be null or empty");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException(String.format(
                    "File size (%d bytes) exceeds the maximum allowed limit of 10 MB (%d bytes)",
                    file.getSize(), MAX_FILE_SIZE_BYTES
            ));
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("Filename cannot be blank");
        }

        String extension = getFileExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported file extension: ." + extension +
                    ". Allowed image formats: JPG, JPEG, PNG, WEBP");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported MIME type: " + contentType +
                    ". Allowed types: image/jpeg, image/png, image/webp");
        }

        // Validate image magic bytes
        byte[] header = new byte[12];
        try (InputStream is = file.getInputStream()) {
            int bytesRead = is.read(header);
            if (bytesRead < 4 || !isRecognizedImageHeader(header)) {
                throw new IllegalArgumentException("The uploaded file does not contain valid image header bytes");
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Failed to read and validate image data: " + e.getMessage());
        }
    }

    private boolean isRecognizedImageHeader(byte[] header) {
        // JPEG: FF D8 FF
        if ((header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF) {
            return true;
        }
        // PNG: 89 50 4E 47 (0x89 'P' 'N' 'G')
        if ((header[0] & 0xFF) == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47) {
            return true;
        }
        // WEBP / RIFF: 52 49 46 46 (0x52 'I' 'F' 'F')
        if (header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46
                && header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P') {
            return true;
        }
        return false;
    }

    /**
     * Loads a file resource for secure streaming.
     */
    public Resource loadAsResource(String relativePath) {
        try {
            Path filePath = this.rootUploadPath.resolve(relativePath).normalize();
            if (!filePath.startsWith(this.rootUploadPath)) {
                throw new IllegalArgumentException("Cannot access file outside upload directory");
            }
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new IllegalArgumentException("File not found or not readable: " + relativePath);
            }
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Malformed file path: " + relativePath, e);
        }
    }

    /**
     * Safely deletes physical file from disk.
     */
    public boolean deletePhysicalFile(String relativePath) {
        if (relativePath == null || relativePath.isBlank()) return false;
        try {
            Path filePath = this.rootUploadPath.resolve(relativePath).normalize();
            if (!filePath.startsWith(this.rootUploadPath)) {
                log.warn("Attempted to delete file outside upload directory: {}", relativePath);
                return false;
            }
            boolean deleted = Files.deleteIfExists(filePath);
            log.info("Physical file deletion for {}: {}", relativePath, deleted);
            return deleted;
        } catch (IOException e) {
            log.warn("Failed to delete physical file: {}", relativePath, e);
            return false;
        }
    }

    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot == -1 || lastDot == filename.length() - 1) {
            return "";
        }
        return filename.substring(lastDot + 1).toLowerCase();
    }

    public static class StoredFileInfo {
        private final String originalFilename;
        private final String generatedFilename;
        private final String relativePath;
        private final String mimeType;
        private final int fileSize;

        public StoredFileInfo(String originalFilename, String generatedFilename, String relativePath, String mimeType, int fileSize) {
            this.originalFilename = originalFilename;
            this.generatedFilename = generatedFilename;
            this.relativePath = relativePath;
            this.mimeType = mimeType;
            this.fileSize = fileSize;
        }

        public String getOriginalFilename() {
            return originalFilename;
        }

        public String getGeneratedFilename() {
            return generatedFilename;
        }

        public String getRelativePath() {
            return relativePath;
        }

        public String getMimeType() {
            return mimeType;
        }

        public int getFileSize() {
            return fileSize;
        }
    }
}
