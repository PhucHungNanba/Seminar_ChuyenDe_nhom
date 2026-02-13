import { useState, useEffect } from 'react'
import { VStack, Box, Text, Heading, Button, HStack, Badge, Spinner, Alert, AlertIcon, LinkBox, LinkOverlay } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { postsApi, handleApiError } from '../services/api'
import { FaHeart, FaComment } from 'react-icons/fa'

function PostList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await postsApi.list()
      setPosts(response.data || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setError(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <VStack spacing={4}>
        <Spinner size="lg" />
        <Text>Loading posts...</Text>
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
        <Button onClick={fetchPosts} colorScheme="blue">
          Retry
        </Button>
      </VStack>
    )
  }

  if (posts.length === 0) {
    return (
      <VStack spacing={4}>
        <Text fontSize="lg" color="gray.500">
          No posts available
        </Text>
        <Button as={Link} to="/create" colorScheme="blue">
          Create the first post
        </Button>
      </VStack>
    )
  }

  return (
    <VStack spacing={6} w="100%">
      <Heading size="lg">Recent Posts</Heading>
      
      {posts.map((post) => (
        <LinkBox as={Box} key={post.id} w="100%" p={6} borderWidth={1} borderRadius="md" shadow="sm" _hover={{ shadow: 'md' }}>
          <VStack align="start" spacing={3}>
            <HStack justify="space-between" w="100%">
              <Badge colorScheme="blue">@{post.username}</Badge>
              <Text fontSize="sm" color="gray.500">
                {format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}
              </Text>
            </HStack>
            
            <LinkOverlay as={Link} to={`/posts/${post.id}`}>
              <Heading size="md" noOfLines={2}>
                Post #{post.id}
              </Heading>
            </LinkOverlay>
            
            <Text noOfLines={3} color="gray.700">
              {post.content}
            </Text>
            
            <HStack spacing={6}>
              <HStack spacing={2}>
                <FaHeart color="red" />
                <Text fontSize="sm">{post.likesCount || 0} likes</Text>
              </HStack>
              <HStack spacing={2}>
                <FaComment color="blue" />
                <Text fontSize="sm">{post.commentsCount || 0} comments</Text>
              </HStack>
            </HStack>
            
            {post.updatedAt !== post.createdAt && (
              <Text fontSize="xs" color="gray.400">
                Updated: {format(new Date(post.updatedAt), 'MMM d, yyyy h:mm a')}
              </Text>
            )}
          </VStack>
        </LinkBox>
      ))}
    </VStack>
  )
}

export default PostList