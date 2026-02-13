package com.contoso.socialapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for updating an existing post")
public class UpdatePostRequest {
    
    @NotBlank(message = "Username is required")
    @Schema(description = "Username of the post author", example = "john_doe", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;
    
    @NotBlank(message = "Content is required")
    @Schema(description = "Updated content of the post", example = "Updated: Just had an amazing hiking experience in the mountains with friends!", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;
}
