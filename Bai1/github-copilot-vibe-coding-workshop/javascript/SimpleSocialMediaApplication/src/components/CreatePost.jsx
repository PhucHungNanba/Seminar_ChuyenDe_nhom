import { useState } from 'react'
import { 
  VStack, 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Button, 
  Alert, 
  AlertIcon, 
  useToast 
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { postsApi, handleApiError } from '../services/api'

function CreatePost() {
  const [formData, setFormData] = useState({
    username: '',
    content: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()
  const toast = useToast()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.content.trim()) {
      setError('Username and content are required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      await postsApi.create(formData)
      
      toast({
        title: 'Post created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      // Navigate back to posts list
      navigate('/')
    } catch (error) {
      console.error('Failed to create post:', error)
      setError(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box w="100%" maxW="2xl" mx="auto">
      <VStack spacing={6}>
        <Heading size="lg">Create New Post</Heading>
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        <Box as="form" onSubmit={handleSubmit} w="100%" p={6} borderWidth={1} borderRadius="md">
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                isDisabled={loading}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Content</FormLabel>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="What's on your mind?"
                rows={6}
                resize="vertical"
                isDisabled={loading}
              />
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              w="100%"
              isLoading={loading}
              loadingText="Creating post..."
            >
              Create Post
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              isDisabled={loading}
            >
              Cancel
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default CreatePost