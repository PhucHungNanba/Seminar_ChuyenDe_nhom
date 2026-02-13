package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.CreatePostRequest;
import com.contoso.socialapp.dto.PostResponse;
import com.contoso.socialapp.dto.UpdatePostRequest;
import com.contoso.socialapp.service.SocialMediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
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
@RequestMapping(value = "/posts", produces = "application/json")
@RequiredArgsConstructor
@Tag(name = "Posts", description = "Post management endpoints")
public class PostController {
    
    private final SocialMediaService socialMediaService;
    
    @GetMapping
    @Operation(
        summary = "List all posts",
        description = "Retrieve a list of all posts in reverse chronological order for browsing.",
        operationId = "listPosts"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successful response with list of posts"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<PostResponse>> listPosts() {
        List<PostResponse> posts = socialMediaService.listPosts();
        return ResponseEntity.ok(posts);
    }
    
    @PostMapping
    @Operation(
        summary = "Create a new post",
        description = "Create a new post to share content with others.",
        operationId = "createPost"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Post created successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - invalid input"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody CreatePostRequest request) {
        PostResponse post = socialMediaService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }
    
    @GetMapping("/{postId}")
    @Operation(
        summary = "Get a single post",
        description = "Retrieve details of a specific post by its ID.",
        operationId = "getPost"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successful response with post details"),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PostResponse> getPost(@PathVariable Long postId) {
        PostResponse post = socialMediaService.getPost(postId);
        return ResponseEntity.ok(post);
    }
    
    @PatchMapping("/{postId}")
    @Operation(
        summary = "Update a post",
        description = "Update the content of an existing post.",
        operationId = "updatePost"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Post updated successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - invalid input"),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody UpdatePostRequest request) {
        PostResponse post = socialMediaService.updatePost(postId, request);
        return ResponseEntity.ok(post);
    }
    
    @DeleteMapping("/{postId}")
    @Operation(
        summary = "Delete a post",
        description = "Delete a specific post by its ID.",
        operationId = "deletePost"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Post deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        socialMediaService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }
}
