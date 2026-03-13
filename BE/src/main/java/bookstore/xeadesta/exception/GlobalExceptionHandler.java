package bookstore.xeadesta.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private Map<String, Object> buildResponse(HttpStatus status, String error, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", status.value());
        response.put("error", error);
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now());
        return response;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return new ResponseEntity<>(
            buildResponse(HttpStatus.BAD_REQUEST, "Bad Request",
                ex.getMessage() != null ? ex.getMessage() : "Invalid request"),
            HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException ex) {
        return new ResponseEntity<>(
            buildResponse(HttpStatus.BAD_REQUEST, "File Too Large",
                "File size exceeds the maximum allowed limit of 2 MB"),
            HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<Map<String, Object>> handleMultipart(MultipartException ex) {
        return new ResponseEntity<>(
            buildResponse(HttpStatus.BAD_REQUEST, "Upload Error",
                "Failed to process file upload: " + (ex.getMessage() != null ? ex.getMessage() : "unknown error")),
            HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NoHandlerFoundException ex) {
        Map<String, Object> response = buildResponse(HttpStatus.NOT_FOUND, "Not Found",
            "The requested resource was not found");
        response.put("path", ex.getRequestURL());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(
            buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
                ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred"),
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        return new ResponseEntity<>(
            buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
                ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred"),
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
