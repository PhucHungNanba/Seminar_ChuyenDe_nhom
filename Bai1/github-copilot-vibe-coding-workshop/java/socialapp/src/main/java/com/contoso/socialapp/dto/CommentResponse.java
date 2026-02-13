package com.contoso.socialapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Comment", description = "A comment on a post")
public class CommentResponse {
    
    @Schema(description = "Unique identifier for the comment", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long id;
    
    @Schema(description = "ID of the post this comment belongs to", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long postId;
    
    @Schema(description = "Username of the comment author", example = "jane_smith", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;
    
    @Schema(description = "Content of the comment", example = "That sounds incredible! Which trail did you take?", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;
    
    @Schema(description = "Timestamp when the comment was created", example = "2025-05-30T13:00:00Z", type = "string", format = "date-time", requiredMode = Schema.RequiredMode.REQUIRED)
    private String createdAt;
    
    @Schema(description = "Timestamp when the comment was last updated", example = "2025-05-30T13:00:00Z", type = "string", format = "date-time", requiredMode = Schema.RequiredMode.REQUIRED)
    private String updatedAt;
}
