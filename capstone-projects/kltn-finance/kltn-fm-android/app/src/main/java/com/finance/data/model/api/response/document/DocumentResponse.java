package com.finance.data.model.api.response.document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    private String name;
    private String url;

    // Method to check if the file is an image
    public boolean isImageFile() {
        if (url == null || url.isEmpty()) {
            return false;
        }

        String lowerCaseUrl = url.toLowerCase();

        return lowerCaseUrl.endsWith(".png") ||
                lowerCaseUrl.endsWith(".jpg") ||
                lowerCaseUrl.endsWith(".jpeg") ||
                lowerCaseUrl.endsWith(".gif") ||
                lowerCaseUrl.endsWith(".bmp") ||
                lowerCaseUrl.endsWith(".webp");
    }

    public boolean isPdfFile() {
        if (url == null || url.isEmpty()) {
            return false;
        }
        return url.toLowerCase().endsWith(".pdf");
    }
}

