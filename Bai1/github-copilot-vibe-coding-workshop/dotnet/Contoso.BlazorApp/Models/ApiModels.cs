using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Contoso.BlazorApp.Models;

public class Post
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [JsonPropertyName("likesCount")]
    public int LikesCount { get; set; }

    [JsonPropertyName("commentsCount")]
    public int CommentsCount { get; set; }
}

public class CreatePostRequest
{
    [Required(ErrorMessage = "Username is required")]
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Content is required")]
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}

public class UpdatePostRequest
{
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}

public class Comment
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}

public class CreateCommentRequest
{
    [Required(ErrorMessage = "Username is required")]
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Comment content is required")]
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}

public class UpdateCommentRequest
{
    [Required(ErrorMessage = "Comment content is required")]
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}

public class LikeRequest
{
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;
}

public class ApiSettings
{
    public const string SectionName = "ApiSettings";
    
    public string BaseUrl { get; set; } = string.Empty;
}