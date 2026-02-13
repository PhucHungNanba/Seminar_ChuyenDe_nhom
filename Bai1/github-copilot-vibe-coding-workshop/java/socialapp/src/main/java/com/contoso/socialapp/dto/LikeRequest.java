package com.contoso.socialapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for liking/unliking a post")
public class LikeRequest {
    
    @NotBlank(message = "Username is required")
    @Schema(description = "Username of the user liking the post", example = "alice_wilson", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;
}
