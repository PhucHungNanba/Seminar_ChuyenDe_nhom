package com.contoso.socialapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Error", description = "Error response")
public class ErrorResponse {
    
    @Schema(description = "Error message describing what went wrong", example = "Post not found", requiredMode = Schema.RequiredMode.REQUIRED)
    private String message;
}
