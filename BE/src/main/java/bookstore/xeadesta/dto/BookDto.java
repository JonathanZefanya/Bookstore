package bookstore.xeadesta.dto;

import lombok.Data;
import java.math.BigDecimal;

public class BookDto {

    @Data
    public static class CreateRequest {
        private String title;
        private String author;
        private String isbn;
        private String description;
        private BigDecimal price;
        private Integer weightGram;
        private Integer publishYear;
        private Integer stock;
        private Long publisherId;
        private Long categoryId;
    }

    @Data
    public static class UpdateRequest {
        private String title;
        private String author;
        private String isbn;
        private String description;
        private BigDecimal price;
        private Integer weightGram;
        private Integer publishYear;
        private Integer stock;
        private Long publisherId;
        private Long categoryId;
    }
}
