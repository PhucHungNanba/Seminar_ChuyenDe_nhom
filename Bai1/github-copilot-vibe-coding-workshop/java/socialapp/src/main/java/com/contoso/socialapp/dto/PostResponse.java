package com.contoso.socialapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Post", description = "A post in the social media feed")
public class PostResponse {
    
    @Schema(description = "Unique identifier for the post", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long id;
    
    @Schema(description = "Username of the post author", example = "john_doe", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;
    
    @Schema(description = "Content of the post", example = "Just had an amazing hiking experience in the mountains!", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;
    
    @Schema(description = "Timestamp when the post was created", example = "2025-05-30T12:00:00Z", type = "string", format = "date-time", requiredMode = Schema.RequiredMode.REQUIRED)
    private String createdAt;
    
    @Schema(description = "Timestamp when the post was last updated", example = "2025-05-30T12:00:00Z", type = "string", format = "date-time", requiredMode = Schema.RequiredMode.REQUIRED)
    private String updatedAt;
    
    @Schema(description = "Number of likes the post has received", example = "0", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer likesCount;
    
    @Schema(description = "Number of comments the post has received", example = "0", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer commentsCount;
}
