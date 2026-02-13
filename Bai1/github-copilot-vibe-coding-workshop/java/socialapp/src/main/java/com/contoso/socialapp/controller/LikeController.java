package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.LikeRequest;
import com.contoso.socialapp.dto.LikeResponse;
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

@RestController
@RequestMapping(value = "/posts/{postId}/likes", produces = "application/json")
@RequiredArgsConstructor
@Tag(name = "Likes", description = "Like management endpoints")
public class LikeController {
    
    private final SocialMediaService socialMediaService;
    
    @PostMapping
    @Operation(
        summary = "Like a post",
        description = "Add a like to a specific post to show appreciation.",
        operationId = "likePost"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Like added successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - invalid input"),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<LikeResponse> likePost(
            @PathVariable Long postId,
            @Valid @RequestBody LikeRequest request) {
        LikeResponse like = socialMediaService.likePost(postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(like);
    }
    
    @DeleteMapping
    @Operation(
        summary = "Unlike a post",
        description = "Remove a like from a specific post.",
        operationId = "unlikePost"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Like removed successfully"),
        @ApiResponse(responseCode = "404", description = "Post or like not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long postId,
            @Valid @RequestBody LikeRequest request) {
        socialMediaService.unlikePost(postId, request);
        return ResponseEntity.noContent().build();
    }
}
