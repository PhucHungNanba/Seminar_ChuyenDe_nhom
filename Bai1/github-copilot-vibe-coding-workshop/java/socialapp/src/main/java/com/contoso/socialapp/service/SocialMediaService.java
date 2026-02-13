package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.entity.Comment;
import com.contoso.socialapp.entity.Like;
import com.contoso.socialapp.entity.Post;
import com.contoso.socialapp.repository.CommentRepository;
import com.contoso.socialapp.repository.LikeRepository;
import com.contoso.socialapp.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SocialMediaService {
    
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
    
    // Helper method to format datetime to ISO format with Z
    private String formatDateTime(java.time.LocalDateTime dateTime) {
        if (dateTime == null) {
            return java.time.OffsetDateTime.now(ZoneOffset.UTC).format(ISO_FORMATTER);
        }
        return dateTime.atOffset(ZoneOffset.UTC).format(ISO_FORMATTER);
    }
    
    // Post methods
    @Transactional(readOnly = true)
    public List<PostResponse> listPosts() {
        List<Post> posts = postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return posts.stream()
                .map(this::toPostResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public PostResponse createPost(CreatePostRequest request) {
        Post post = new Post();
        post.setUsername(request.getUsername());
        post.setContent(request.getContent());
        post.setLikesCount(0);
        post.setCommentsCount(0);
        
        Post savedPost = postRepository.save(post);
        return toPostResponse(savedPost);
    }
    
    @Transactional(readOnly = true)
    public PostResponse getPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return toPostResponse(post);
    }
    
    @Transactional
    public PostResponse updatePost(Long postId, UpdatePostRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        post.setUsername(request.getUsername());
        post.setContent(request.getContent());
        
        Post updatedPost = postRepository.save(post);
        return toPostResponse(updatedPost);
    }
    
    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        postRepository.delete(post);
    }
    
    // Comment methods
    @Transactional(readOnly = true)
    public List<CommentResponse> listComments(Long postId) {
        // Check if post exists
        postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        return comments.stream()
                .map(this::toCommentResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CommentResponse createComment(Long postId, CreateCommentRequest request) {
        // Check if post exists
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUsername(request.getUsername());
        comment.setContent(request.getContent());
        
        Comment savedComment = commentRepository.save(comment);
        
        // Update post comments count
        updatePostCounts(postId);
        
        return toCommentResponse(savedComment);
    }
    
    @Transactional(readOnly = true)
    public CommentResponse getComment(Long postId, Long commentId) {
        // Check if post exists
        postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = commentRepository.findByIdAndPostId(commentId, postId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        return toCommentResponse(comment);
    }
    
    @Transactional
    public CommentResponse updateComment(Long postId, Long commentId, UpdateCommentRequest request) {
        // Check if post exists
        postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = commentRepository.findByIdAndPostId(commentId, postId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.setUsername(request.getUsername());
        comment.setContent(request.getContent());
        
        Comment updatedComment = commentRepository.save(comment);
        return toCommentResponse(updatedComment);
    }
    
    @Transactional
    public void deleteComment(Long postId, Long commentId) {
        // Check if post exists
        postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = commentRepository.findByIdAndPostId(commentId, postId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        commentRepository.delete(comment);
        
        // Update post comments count
        updatePostCounts(postId);
    }
    
    // Like methods
    @Transactional
    public LikeResponse likePost(Long postId, LikeRequest request) {
        // Check if post exists
        postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Check if user already liked this post
        if (likeRepository.existsByPostIdAndUsername(postId, request.getUsername())) {
            throw new RuntimeException("User already liked this post");
        }
        
        Like like = new Like();
        like.setPostId(postId);
        like.setUsername(request.getUsername());
        
        Like savedLike = likeRepository.save(like);
        
        // Update post likes count
        updatePostCounts(postId);
        
        return toLikeResponse(savedLike);
    }
    
    @Transactional
    public void unlikePost(Long postId, LikeRequest request) {
        // Check if post exists
        postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Like like = likeRepository.findByPostIdAndUsername(postId, request.getUsername())
                .orElseThrow(() -> new RuntimeException("Like not found"));
        
        likeRepository.delete(like);
        
        // Update post likes count
        updatePostCounts(postId);
    }
    
    // Helper methods
    private void updatePostCounts(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow();
        
        long likesCount = likeRepository.countByPostId(postId);
        long commentsCount = commentRepository.countByPostId(postId);
        
        post.setLikesCount((int) likesCount);
        post.setCommentsCount((int) commentsCount);
        
        postRepository.save(post);
    }
    
    private PostResponse toPostResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setUsername(post.getUsername());
        response.setContent(post.getContent());
        response.setCreatedAt(formatDateTime(post.getCreatedAt()));
        response.setUpdatedAt(formatDateTime(post.getUpdatedAt()));
        response.setLikesCount(post.getLikesCount());
        response.setCommentsCount(post.getCommentsCount());
        return response;
    }
    
    private CommentResponse toCommentResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setPostId(comment.getPostId());
        response.setUsername(comment.getUsername());
        response.setContent(comment.getContent());
        response.setCreatedAt(formatDateTime(comment.getCreatedAt()));
        response.setUpdatedAt(formatDateTime(comment.getUpdatedAt()));
        return response;
    }
    
    private LikeResponse toLikeResponse(Like like) {
        LikeResponse response = new LikeResponse();
        response.setId(like.getId());
        response.setPostId(like.getPostId());
        response.setUsername(like.getUsername());
        response.setCreatedAt(formatDateTime(like.getCreatedAt()));
        return response;
    }
}
