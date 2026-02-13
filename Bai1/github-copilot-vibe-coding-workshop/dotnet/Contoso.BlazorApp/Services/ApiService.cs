using System.Net.Http.Json;
using Contoso.BlazorApp.Models;

namespace Contoso.BlazorApp.Services;

public class ApiService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<ApiService> _logger;

    public ApiService(HttpClient httpClient, ILogger<ApiService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    // Health check
    public async Task<bool> CheckApiHealthAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("/posts");
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "API health check failed");
            return false;
        }
    }

    // Posts API
    public async Task<List<Post>> GetPostsAsync()
    {
        try
        {
            var posts = await _httpClient.GetFromJsonAsync<List<Post>>("/posts");
            return posts ?? new List<Post>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch posts");
            throw new ApplicationException("Failed to fetch posts", ex);
        }
    }

    public async Task<Post> GetPostAsync(int postId)
    {
        try
        {
            var post = await _httpClient.GetFromJsonAsync<Post>($"/posts/{postId}");
            return post ?? throw new ApplicationException($"Post with ID {postId} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch post {PostId}", postId);
            throw new ApplicationException($"Failed to fetch post {postId}", ex);
        }
    }

    public async Task<Post> CreatePostAsync(CreatePostRequest request)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync("/posts", request);
            response.EnsureSuccessStatusCode();
            
            var post = await response.Content.ReadFromJsonAsync<Post>();
            return post ?? throw new ApplicationException("Failed to create post");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create post");
            throw new ApplicationException("Failed to create post", ex);
        }
    }

    public async Task<Post> UpdatePostAsync(int postId, UpdatePostRequest request)
    {
        try
        {
            var response = await _httpClient.PatchAsync($"/posts/{postId}", JsonContent.Create(request));
            response.EnsureSuccessStatusCode();
            
            var post = await response.Content.ReadFromJsonAsync<Post>();
            return post ?? throw new ApplicationException("Failed to update post");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update post {PostId}", postId);
            throw new ApplicationException($"Failed to update post {postId}", ex);
        }
    }

    public async Task DeletePostAsync(int postId)
    {
        try
        {
            var response = await _httpClient.DeleteAsync($"/posts/{postId}");
            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete post {PostId}", postId);
            throw new ApplicationException($"Failed to delete post {postId}", ex);
        }
    }

    // Comments API
    public async Task<List<Comment>> GetCommentsAsync(int postId)
    {
        try
        {
            var comments = await _httpClient.GetFromJsonAsync<List<Comment>>($"/posts/{postId}/comments");
            return comments ?? new List<Comment>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch comments for post {PostId}", postId);
            throw new ApplicationException($"Failed to fetch comments for post {postId}", ex);
        }
    }

    public async Task<Comment> CreateCommentAsync(int postId, CreateCommentRequest request)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync($"/posts/{postId}/comments", request);
            response.EnsureSuccessStatusCode();
            
            var comment = await response.Content.ReadFromJsonAsync<Comment>();
            return comment ?? throw new ApplicationException("Failed to create comment");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create comment for post {PostId}", postId);
            throw new ApplicationException($"Failed to create comment for post {postId}", ex);
        }
    }

    public async Task<Comment> UpdateCommentAsync(int postId, int commentId, UpdateCommentRequest request)
    {
        try
        {
            var response = await _httpClient.PatchAsync($"/posts/{postId}/comments/{commentId}", JsonContent.Create(request));
            response.EnsureSuccessStatusCode();
            
            var comment = await response.Content.ReadFromJsonAsync<Comment>();
            return comment ?? throw new ApplicationException("Failed to update comment");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update comment {CommentId} for post {PostId}", commentId, postId);
            throw new ApplicationException($"Failed to update comment {commentId} for post {postId}", ex);
        }
    }

    public async Task DeleteCommentAsync(int postId, int commentId)
    {
        try
        {
            var response = await _httpClient.DeleteAsync($"/posts/{postId}/comments/{commentId}");
            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete comment {CommentId} for post {PostId}", commentId, postId);
            throw new ApplicationException($"Failed to delete comment {commentId} for post {postId}", ex);
        }
    }

    // Likes API
    public async Task LikePostAsync(int postId, LikeRequest request)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync($"/posts/{postId}/likes", request);
            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to like post {PostId}", postId);
            throw new ApplicationException($"Failed to like post {postId}", ex);
        }
    }

    public async Task UnlikePostAsync(int postId, LikeRequest request)
    {
        try
        {
            var response = await _httpClient.SendAsync(new HttpRequestMessage(HttpMethod.Delete, $"/posts/{postId}/likes")
            {
                Content = JsonContent.Create(request)
            });
            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to unlike post {PostId}", postId);
            throw new ApplicationException($"Failed to unlike post {postId}", ex);
        }
    }
}