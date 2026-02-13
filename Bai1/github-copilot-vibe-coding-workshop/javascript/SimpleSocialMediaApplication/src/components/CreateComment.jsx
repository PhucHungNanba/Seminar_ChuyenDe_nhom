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
  useToast,
  Collapse,
  useDisclosure
} from '@chakra-ui/react'
import { FaComment } from 'react-icons/fa'
import { commentsApi, handleApiError } from '../services/api'

function CreateComment({ postId, onCommentCreated }) {
  const [formData, setFormData] = useState({
    username: '',
    content: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isOpen, onToggle } = useDisclosure()
  
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
      
      await commentsApi.create(postId, formData)
      
      toast({
        title: 'Comment posted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      // Reset form
      setFormData({ username: '', content: '' })
      
      // Refresh comments and post data
      if (onCommentCreated) {
        onCommentCreated()
      }
      
      // Close the form
      onToggle()
    } catch (error) {
      console.error('Failed to create comment:', error)
      setError(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ username: '', content: '' })
    setError(null)
    onToggle()
  }

  return (
    <VStack spacing={4} w="100%">
      <Button 
        leftIcon={<FaComment />} 
        onClick={onToggle}
        colorScheme="blue"
        variant="outline"
        size="lg"
      >
        {isOpen ? 'Cancel Comment' : 'Add Comment'}
      </Button>
      
      <Collapse in={isOpen} style={{ width: '100%' }}>
        <Box w="100%" p={6} borderWidth={1} borderRadius="md" bg="gray.50">
          <VStack spacing={4}>
            <Heading size="md">Add a Comment</Heading>
            
            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
            
            <Box as="form" onSubmit={handleSubmit} w="100%">
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    isDisabled={loading}
                    bg="white"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Comment</FormLabel>
                  <Textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Share your thoughts..."
                    rows={4}
                    resize="vertical"
                    isDisabled={loading}
                    bg="white"
                  />
                </FormControl>
                
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="100%"
                  isLoading={loading}
                  loadingText="Posting comment..."
                >
                  Post Comment
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  isDisabled={loading}
                  w="100%"
                >
                  Cancel
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Collapse>
    </VStack>
  )
}

export default CreateComment