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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { FaEdit } from 'react-icons/fa'
import { postsApi, handleApiError } from '../services/api'

function UpdatePost({ post, onPostUpdated }) {
  const [formData, setFormData] = useState({
    username: post?.username || '',
    content: post?.content || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  
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
      
      await postsApi.update(post.id, formData)
      
      toast({
        title: 'Post updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      // Refresh post data
      if (onPostUpdated) {
        onPostUpdated()
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to update post:', error)
      setError(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setFormData({
      username: post?.username || '',
      content: post?.content || ''
    })
    setError(null)
    onOpen()
  }

  return (
    <>
      <Button 
        leftIcon={<FaEdit />} 
        onClick={handleOpenModal}
        colorScheme="blue"
        variant="outline"
        size="sm"
      >
        Update Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Post</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
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
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Content</FormLabel>
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Update your post content"
                      rows={6}
                      resize="vertical"
                      isDisabled={loading}
                    />
                  </FormControl>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Updating post..."
            >
              Update Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdatePost