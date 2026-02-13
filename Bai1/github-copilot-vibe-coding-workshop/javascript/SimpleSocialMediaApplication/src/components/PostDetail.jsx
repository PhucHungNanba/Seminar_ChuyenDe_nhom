import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  VStack, 
  Box, 
  Text, 
  Heading, 
  Button, 
  HStack, 
  Badge, 
  Spinner, 
  Alert, 
  AlertIcon,
  useToast,
  Divider
} from '@chakra-ui/react'
import { format } from 'date-fns'
import { FaHeart, FaComment, FaArrowLeft } from 'react-icons/fa'
import { postsApi, handleApiError } from '../services/api'
import CommentsList from './CommentsList'
import CreateComment from './CreateComment'
import LikeButton from './LikeButton'
import UpdatePost from './UpdatePost'

function PostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await postsApi.get(postId)
      setPost(response.data)
    } catch (error) {
      console.error('Failed to fetch post:', error)
      setError(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await postsApi.delete(postId)
      toast({
        title: 'Post deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/')
    } catch (error) {
      console.error('Failed to delete post:', error)
      toast({
        title: 'Failed to delete post',
        description: handleApiError(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (loading) {
    return (
      <VStack spacing={4}>
        <Spinner size="lg" />
        <Text>Loading post...</Text>
      </VStack>
    )
  }

  if (error) {
    return (
      <VStack spacing={4}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
        <Button onClick={fetchPost} colorScheme="blue">
          Retry
        </Button>
        <Button onClick={() => navigate('/')} variant="ghost" leftIcon={<FaArrowLeft />}>
          Back to Posts
        </Button>
      </VStack>
    )
  }

  if (!post) {
    return (
      <VStack spacing={4}>
        <Text>Post not found</Text>
        <Button onClick={() => navigate('/')} leftIcon={<FaArrowLeft />}>
          Back to Posts
        </Button>
      </VStack>
    )
  }

  return (
    <VStack spacing={6} w="100%">
      <HStack w="100%">
        <Button onClick={() => navigate('/')} leftIcon={<FaArrowLeft />} variant="ghost">
          Back to Posts
        </Button>
      </HStack>
      
      <Box w="100%" p={6} borderWidth={1} borderRadius="md" shadow="sm">
        <VStack align="start" spacing={4}>
          <HStack justify="space-between" w="100%">
            <Badge colorScheme="blue" fontSize="md">@{post.username}</Badge>
            <Text fontSize="sm" color="gray.500">
              {format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}
            </Text>
          </HStack>
          
          <Heading size="lg">Post #{post.id}</Heading>
          
          <Text fontSize="lg" lineHeight="tall">
            {post.content}
          </Text>
          
          <HStack spacing={6}>
            <HStack spacing={2}>
              <FaHeart color="red" />
              <Text>{post.likesCount || 0} likes</Text>
            </HStack>
            <HStack spacing={2}>
              <FaComment color="blue" />
              <Text>{post.commentsCount || 0} comments</Text>
            </HStack>
          </HStack>
          
          {post.updatedAt !== post.createdAt && (
            <Text fontSize="sm" color="gray.500">
              Updated: {format(new Date(post.updatedAt), 'MMM d, yyyy h:mm a')}
            </Text>
          )}
          
          <HStack spacing={4}>
            <LikeButton postId={post.id} onLikeChange={fetchPost} />
            <UpdatePost post={post} onPostUpdated={fetchPost} />
            <Button onClick={handleDeletePost} colorScheme="red" variant="outline" size="sm">
              Delete Post
            </Button>
          </HStack>
        </VStack>
      </Box>
      
      <Divider />
      
      <CreateComment postId={post.id} onCommentCreated={fetchPost} />
      
      <CommentsList postId={post.id} />
    </VStack>
  )
}

export default PostDetail