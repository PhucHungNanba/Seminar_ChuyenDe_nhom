package com.contoso.socialapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for creating a new comment")
public class CreateCommentRequest {
    
    @NotBlank(message = "Username is required")
    @Schema(description = "Username of the comment author", example = "jane_smith", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;
    
    @NotBlank(message = "Content is required")
    @Schema(description = "Content of the comment", example = "That sounds incredible! Which trail did you take?", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;
}
