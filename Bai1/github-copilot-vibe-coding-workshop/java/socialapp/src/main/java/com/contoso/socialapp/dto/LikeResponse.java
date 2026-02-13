package com.contoso.socialapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Like", description = "A like on a post")
public class LikeResponse {
    
    @Schema(description = "Unique identifier for the like", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long id;
    
    @Schema(description = "ID of the post that was liked", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long postId;
    
    @Schema(description = "Username of the user who liked the post", example = "alice_wilson", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;
    
    @Schema(description = "Timestamp when the like was created", example = "2025-05-30T14:00:00Z", type = "string", format = "date-time", requiredMode = Schema.RequiredMode.REQUIRED)
    private String createdAt;
}
