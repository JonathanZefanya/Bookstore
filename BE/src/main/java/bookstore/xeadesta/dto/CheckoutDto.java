package bookstore.xeadesta.dto;

import lombok.Data;

public class CheckoutDto {

    @Data
    public static class CheckoutRequest {
        private String shippingAddress;
        private String notes;
    }
}
