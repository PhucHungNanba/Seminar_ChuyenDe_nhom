import { useState, useEffect } from 'react'
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
import { FaTrash, FaEdit } from 'react-icons/fa'
import { commentsApi, handleApiError } from '../services/api'
import UpdateComment from './UpdateComment'

function CommentsList({ postId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState({})
  const [isUpdating, setIsUpdating] = useState(null)
  
  const toast = useToast()

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await commentsApi.list(postId)
      setComments(response.data || [])
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      setError(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return
    }

    try {
      setDeleteLoading(prev => ({ ...prev, [commentId]: true }))
      
      await commentsApi.delete(postId, commentId)
      
      toast({
        title: 'Comment deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      // Refresh comments
      fetchComments()
    } catch (error) {
      console.error('Failed to delete comment:', error)
      toast({
        title: 'Failed to delete comment',
        description: handleApiError(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setDeleteLoading(prev => ({ ...prev, [commentId]: false }))
    }
  }

  const handleUpdateComment = (commentId) => {
    setIsUpdating(commentId)
  }

  const handleUpdateSuccess = (updatedComment) => {
    setComments(prev => prev.map(comment => 
      comment.id === updatedComment.id ? updatedComment : comment
    ))
    setIsUpdating(null)
    
    toast({
      title: 'Comment updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleUpdateCancel = () => {
    setIsUpdating(null)
  }

  if (loading) {
    return (
      <VStack spacing={4} w="100%">
        <Heading size="md">Comments</Heading>
        <Spinner size="md" />
        <Text>Loading comments...</Text>
      </VStack>
    )
  }

  if (error) {
    return (
      <VStack spacing={4} w="100%">
        <Heading size="md">Comments</Heading>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
        <Button onClick={fetchComments} colorScheme="blue" size="sm">
          Retry
        </Button>
      </VStack>
    )
  }

  return (
    <VStack spacing={6} w="100%" align="start">
      <Heading size="md">
        Comments ({comments.length})
      </Heading>
      
      {comments.length === 0 ? (
        <Box w="100%" textAlign="center" py={8}>
          <Text color="gray.500" fontSize="lg">
            No comments yet
          </Text>
          <Text color="gray.400" fontSize="sm">
            Be the first to share your thoughts!
          </Text>
        </Box>
      ) : (
        <VStack spacing={4} w="100%">
          {comments.map((comment, index) => (
            <Box key={comment.id} w="100%">
              <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
                <VStack align="start" spacing={3}>
                  <HStack justify="space-between" w="100%">
                    <HStack>
                      <Badge colorScheme="green">@{comment.username}</Badge>
                      <Text fontSize="sm" color="gray.500">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                      </Text>
                    </HStack>
                    
                    <HStack>
                      <Button
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        leftIcon={<FaEdit />}
                        onClick={() => handleUpdateComment(comment.id)}
                      >
                        Edit
                      </Button>
                      
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        leftIcon={<FaTrash />}
                        onClick={() => handleDeleteComment(comment.id)}
                        isLoading={deleteLoading[comment.id]}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </HStack>
                  
                  <Text lineHeight="tall">
                    {comment.content}
                  </Text>
                  
                  {comment.updatedAt !== comment.createdAt && (
                    <Text fontSize="xs" color="gray.400">
                      Updated: {format(new Date(comment.updatedAt), 'MMM d, yyyy h:mm a')}
                    </Text>
                  )}
                </VStack>
              </Box>
              
              {index < comments.length - 1 && <Divider />}
            </Box>
          ))}
        </VStack>
      )}
      
      {isUpdating && (
        <UpdateComment
          postId={postId}
          comment={comments.find(comment => comment.id === isUpdating)}
          isOpen={true}
          onClose={handleUpdateCancel}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </VStack>
  )
}

export default CommentsList