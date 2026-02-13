package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.CommentResponse;
import com.contoso.socialapp.dto.CreateCommentRequest;
import com.contoso.socialapp.dto.UpdateCommentRequest;
import com.contoso.socialapp.service.SocialMediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/posts/{postId}/comments", produces = "application/json")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Comment management endpoints")
public class CommentController {
    
    private final SocialMediaService socialMediaService;
    
    @GetMapping
    @Operation(
        summary = "List comments for a post",
        description = "Retrieve all comments for a specific post.",
        operationId = "listComments"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successful response with list of comments"),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<CommentResponse>> listComments(@PathVariable Long postId) {
        List<CommentResponse> comments = socialMediaService.listComments(postId);
        return ResponseEntity.ok(comments);
    }
    
    @PostMapping
    @Operation(
        summary = "Create a comment on a post",
        description = "Add a new comment to a specific post to share thoughts.",
        operationId = "createComment"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Comment created successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - invalid input"),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse comment = socialMediaService.createComment(postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }
    
    @GetMapping("/{commentId}")
    @Operation(
        summary = "Get a specific comment",
        description = "Retrieve details of a specific comment by its ID.",
        operationId = "getComment"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successful response with comment details"),
        @ApiResponse(responseCode = "404", description = "Comment or post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<CommentResponse> getComment(
            @PathVariable Long postId,
            @PathVariable Long commentId) {
        CommentResponse comment = socialMediaService.getComment(postId, commentId);
        return ResponseEntity.ok(comment);
    }
    
    @PatchMapping("/{commentId}")
    @Operation(
        summary = "Update a comment",
        description = "Update the content of an existing comment.",
        operationId = "updateComment"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comment updated successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - invalid input"),
        @ApiResponse(responseCode = "404", description = "Comment or post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateCommentRequest request) {
        CommentResponse comment = socialMediaService.updateComment(postId, commentId, request);
        return ResponseEntity.ok(comment);
    }
    
    @DeleteMapping("/{commentId}")
    @Operation(
        summary = "Delete a comment",
        description = "Delete a specific comment by its ID.",
        operationId = "deleteComment"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Comment deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Comment or post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId) {
        socialMediaService.deleteComment(postId, commentId);
        return ResponseEntity.noContent().build();
    }
}
