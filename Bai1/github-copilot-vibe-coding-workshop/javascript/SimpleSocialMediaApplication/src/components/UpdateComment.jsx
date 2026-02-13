import { useState } from 'react'
import { 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  VStack, 
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
import { commentsApi, handleApiError } from '../services/api'

function UpdateComment({ comment, postId, onCommentUpdated }) {
  const [formData, setFormData] = useState({
    username: comment?.username || '',
    content: comment?.content || ''
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
      
      await commentsApi.update(postId, comment.id, formData)
      
      toast({
        title: 'Comment updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      // Refresh comments data
      if (onCommentUpdated) {
        onCommentUpdated()
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to update comment:', error)
      setError(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setFormData({
      username: comment?.username || '',
      content: comment?.content || ''
    })
    setError(null)
    onOpen()
  }

  return (
    <>
      <Button
        size="xs"
        colorScheme="blue"
        variant="ghost"
        leftIcon={<FaEdit />}
        onClick={handleOpenModal}
      >
        Edit
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Comment</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              
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
                <FormLabel>Comment</FormLabel>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Update your comment"
                  rows={4}
                  resize="vertical"
                  isDisabled={loading}
                />
              </FormControl>
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
              loadingText="Updating comment..."
            >
              Update Comment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateComment