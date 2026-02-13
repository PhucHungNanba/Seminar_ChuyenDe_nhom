"""
Simple Social Media API

A basic Social Networking Service (SNS) API that allows users to create,
retrieve, update, and delete posts; add comments; and like/unlike posts.
"""
import sqlite3
import os
from contextlib import contextmanager
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# Database setup
DATABASE_NAME = "sns_api.db"

@contextmanager
def get_db_connection():
    """Get database connection context manager."""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_database():
    """Initialize database tables."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Create posts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                likes_count INTEGER DEFAULT 0,
                comments_count INTEGER DEFAULT 0
            )
        """)
        
        # Create comments table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                post_id INTEGER NOT NULL,
                username TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
            )
        """)
        
        # Create likes table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS likes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                post_id INTEGER NOT NULL,
                username TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(post_id, username),
                FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
            )
        """)
        
        conn.commit()


# Pydantic schemas based on OpenAPI specification
class PostBase(BaseModel):
    username: str
    content: str


class CreatePostRequest(BaseModel):
    username: str
    content: str


class UpdatePostRequest(BaseModel):
    username: str
    content: str


class Post(BaseModel):
    id: int
    username: str
    content: str
    createdAt: str
    updatedAt: str
    likesCount: int
    commentsCount: int


class CommentBase(BaseModel):
    username: str
    content: str


class CreateCommentRequest(BaseModel):
    username: str
    content: str


class UpdateCommentRequest(BaseModel):
    username: str
    content: str


class Comment(BaseModel):
    id: int
    postId: int
    username: str
    content: str
    createdAt: str
    updatedAt: str


class LikeRequest(BaseModel):
    username: str


class Like(BaseModel):
    id: int
    postId: int
    username: str
    createdAt: str


class Error(BaseModel):
    message: str


# FastAPI app configuration
app = FastAPI(
    title="Simple Social Media API",
    description="A basic Social Networking Service (SNS) API that allows users to create, retrieve, update, and delete posts; add comments; and like/unlike posts.",
    version="1.0.0",
    contact={
        "name": "Contoso Product Team",
        "email": "support@contoso.com"
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
    }
)

# Add CORS middleware to allow requests from everywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    """Initialize database on startup."""
    init_database()


# Helper functions
def get_post_by_id(post_id: int) -> Optional[dict]:
    """Get post by ID from database."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, username, content, created_at, updated_at, likes_count, comments_count
            FROM posts WHERE id = ?
        """, (post_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def get_comment_by_id(post_id: int, comment_id: int) -> Optional[dict]:
    """Get comment by ID from database."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, post_id, username, content, created_at, updated_at
            FROM comments WHERE id = ? AND post_id = ?
        """, (comment_id, post_id))
        row = cursor.fetchone()
        return dict(row) if row else None


def update_post_counts(post_id: int):
    """Update likes_count and comments_count for a post."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Update likes count
        cursor.execute("SELECT COUNT(*) FROM likes WHERE post_id = ?", (post_id,))
        likes_count = cursor.fetchone()[0]
        
        # Update comments count
        cursor.execute("SELECT COUNT(*) FROM comments WHERE post_id = ?", (post_id,))
        comments_count = cursor.fetchone()[0]
        
        # Update post
        cursor.execute("""
            UPDATE posts SET likes_count = ?, comments_count = ? WHERE id = ?
        """, (likes_count, comments_count, post_id))
        
        conn.commit()


def format_datetime(dt_str: str) -> str:
    """Format datetime string to ISO format."""
    if not dt_str:
        return datetime.now().isoformat() + "Z"
    try:
        # Handle SQLite datetime format
        dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
        return dt.isoformat() + "Z"
    except:
        return datetime.now().isoformat() + "Z"


# API Endpoints

@app.get("/api/posts", response_model=List[Post], tags=["Posts"])
async def list_posts():
    """Retrieve a list of all posts in reverse chronological order for browsing."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, username, content, created_at, updated_at, likes_count, comments_count
            FROM posts ORDER BY created_at DESC
        """)
        rows = cursor.fetchall()
        
        posts = []
        for row in rows:
            post = Post(
                id=row["id"],
                username=row["username"],
                content=row["content"],
                createdAt=format_datetime(row["created_at"]),
                updatedAt=format_datetime(row["updated_at"]),
                likesCount=row["likes_count"] or 0,
                commentsCount=row["comments_count"] or 0
            )
            posts.append(post)
        
        return posts


@app.post("/api/posts", response_model=Post, tags=["Posts"], status_code=201)
async def create_post(request: CreatePostRequest):
    """Create a new post to share content with others."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        now = datetime.now().isoformat()
        
        cursor.execute("""
            INSERT INTO posts (username, content, created_at, updated_at, likes_count, comments_count)
            VALUES (?, ?, ?, ?, 0, 0)
        """, (request.username, request.content, now, now))
        
        post_id = cursor.lastrowid
        conn.commit()
        
        return Post(
            id=post_id,
            username=request.username,
            content=request.content,
            createdAt=format_datetime(now),
            updatedAt=format_datetime(now),
            likesCount=0,
            commentsCount=0
        )


@app.get("/api/posts/{postId}", response_model=Post, tags=["Posts"])
async def get_post(postId: int):
    """Retrieve details of a specific post by its ID."""
    post = get_post_by_id(postId)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return Post(
        id=post["id"],
        username=post["username"],
        content=post["content"],
        createdAt=format_datetime(post["created_at"]),
        updatedAt=format_datetime(post["updated_at"]),
        likesCount=post["likes_count"] or 0,
        commentsCount=post["comments_count"] or 0
    )


@app.patch("/api/posts/{postId}", response_model=Post, tags=["Posts"])
async def update_post(postId: int, request: UpdatePostRequest):
    """Update the content of an existing post."""
    # Check if post exists
    existing_post = get_post_by_id(postId)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        now = datetime.now().isoformat()
        
        cursor.execute("""
            UPDATE posts SET username = ?, content = ?, updated_at = ?
            WHERE id = ?
        """, (request.username, request.content, now, postId))
        
        conn.commit()
        
        # Get updated post
        updated_post = get_post_by_id(postId)
        return Post(
            id=updated_post["id"],
            username=updated_post["username"],
            content=updated_post["content"],
            createdAt=format_datetime(updated_post["created_at"]),
            updatedAt=format_datetime(updated_post["updated_at"]),
            likesCount=updated_post["likes_count"] or 0,
            commentsCount=updated_post["comments_count"] or 0
        )


@app.delete("/api/posts/{postId}", tags=["Posts"], status_code=204)
async def delete_post(postId: int):
    """Delete a specific post by its ID."""
    # Check if post exists
    existing_post = get_post_by_id(postId)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM posts WHERE id = ?", (postId,))
        conn.commit()


@app.get("/api/posts/{postId}/comments", response_model=List[Comment], tags=["Comments"])
async def list_comments(postId: int):
    """Retrieve all comments for a specific post."""
    # Check if post exists
    existing_post = get_post_by_id(postId)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, post_id, username, content, created_at, updated_at
            FROM comments WHERE post_id = ? ORDER BY created_at ASC
        """, (postId,))
        rows = cursor.fetchall()
        
        comments = []
        for row in rows:
            comment = Comment(
                id=row["id"],
                postId=row["post_id"],
                username=row["username"],
                content=row["content"],
                createdAt=format_datetime(row["created_at"]),
                updatedAt=format_datetime(row["updated_at"])
            )
            comments.append(comment)
        
        return comments


@app.post("/api/posts/{postId}/comments", response_model=Comment, tags=["Comments"], status_code=201)
async def create_comment(postId: int, request: CreateCommentRequest):
    """Add a new comment to a specific post to share thoughts."""
    # Check if post exists
    existing_post = get_post_by_id(postId)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        now = datetime.now().isoformat()
        
        cursor.execute("""
            INSERT INTO comments (post_id, username, content, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (postId, request.username, request.content, now, now))
        
        comment_id = cursor.lastrowid
        conn.commit()
        
        # Update post comments count
        update_post_counts(postId)
        
        return Comment(
            id=comment_id,
            postId=postId,
            username=request.username,
            content=request.content,
            createdAt=format_datetime(now),
            updatedAt=format_datetime(now)
        )


@app.get("/api/posts/{postId}/comments/{commentId}", response_model=Comment, tags=["Comments"])
async def get_comment(postId: int, commentId: int):
    """Retrieve details of a specific comment by its ID."""
    # Check if post exists
    existing_post = get_post_by_id(postId)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comment = get_comment_by_id(postId, commentId)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return Comment(
        id=comment["id"],
        postId=comment["post_id"],
        username=comment["username"],
        content=comment["content"],
        createdAt=format_datetime(comment["created_at"]),
        updatedAt=format_datetime(comment["updated_at"])
    )


@app.patch("/api/posts/{postId}/comments/{commentId}", response_model=Comment, tags=["Comments"])
async def update_comment(postId: int, commentId: int, request: UpdateCommentRequest):
    """Update the content of an existing comment."""
    # Check if post exists
    existing_post = get_post_by_id(postId)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if comment exists
    existing_comment = get_comment_by_id(postId, commentId)
    if not existing_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        now = datetime.now().isoformat()
        
        cursor.execute("""
            UPDATE comments SET username = ?, content = ?, updated_at = ?
            WHERE id = ? AND post_id = ?
        """, (request.username, request.content, now, commentId, postId))
        
        conn.commit()
        
        # Get updated comment
        updated_comment = get_comment_by_id(postId, commentId)
        return Comment(
            id=updated_comment["id"],
            postId=updated_comment["post_id"],
            username=updated_comment["username"],
            content=updated_comment["content"],
            createdAt=format_datetime(updated_comment["created_at"]),
            updatedAt=format_datetime(updated_comment["updated_at"])
        )


@app.delete("/api/posts/{postId}/comments/{commentId}", tags=["Comments"], status_code=204)
async def delete_comment(postId: int, commentId: int):
    """Delete a specific comment by its ID."""
    # Check if post exists
    existing_post = get_post_by_id(postId)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if comment exists
    existing_comment = get_comment_by_id(postId, commentId)
    if not existing_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM comments WHERE id = ? AND post_id = ?", (commentId, postId))
        conn.commit()
        
        # Update post comments count
        update_post_counts(postId)


@app.post("/api/posts/{postId}/likes", response_model=Like, tags=["Likes"], status_code=201)
async def like_post(postId: int, request: LikeRequest):
    """Add a like to a specific post to show appreciation."""
    # Check if post exists
    existing_post = get_post_by_id(postId)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if user already liked this post
        cursor.execute("""
            SELECT id FROM likes WHERE post_id = ? AND username = ?
        """, (postId, request.username))
        
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="User already liked this post")
        
        now = datetime.now().isoformat()
        
        cursor.execute("""
            INSERT INTO likes (post_id, username, created_at)
            VALUES (?, ?, ?)
        """, (postId, request.username, now))
        
        like_id = cursor.lastrowid
        conn.commit()
        
        # Update post likes count
        update_post_counts(postId)
        
        return Like(
            id=like_id,
            postId=postId,
            username=request.username,
            createdAt=format_datetime(now)
        )


@app.delete("/api/posts/{postId}/likes", tags=["Likes"], status_code=204)
async def unlike_post(postId: int, request: LikeRequest):
    """Remove a like from a specific post."""
    # Check if post exists
    existing_post = get_post_by_id(postId)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if like exists
        cursor.execute("""
            SELECT id FROM likes WHERE post_id = ? AND username = ?
        """, (postId, request.username))
        
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Like not found")
        
        cursor.execute("""
            DELETE FROM likes WHERE post_id = ? AND username = ?
        """, (postId, request.username))
        
        conn.commit()
        
        # Update post likes count
        update_post_counts(postId)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
