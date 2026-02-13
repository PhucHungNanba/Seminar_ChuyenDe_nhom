package com.contoso.socialapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for updating an existing comment")
public class UpdateCommentRequest {
    
    @NotBlank(message = "Username is required")
    @Schema(description = "Username of the comment author", example = "jane_smith", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;
    
    @NotBlank(message = "Content is required")
    @Schema(description = "Updated content of the comment", example = "That sounds incredible! Which trail did you take? I'd love to try it myself.", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;
}
