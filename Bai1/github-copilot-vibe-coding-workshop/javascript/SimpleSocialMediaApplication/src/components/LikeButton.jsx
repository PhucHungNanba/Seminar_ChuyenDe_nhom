import { useState } from 'react'
import { 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
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
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { likesApi, handleApiError } from '../services/api'

function LikeButton({ postId, onLikeChange }) {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [actionType, setActionType] = useState('like') // 'like' or 'unlike'
  const toast = useToast()

  const handleLikeAction = async (action) => {
    if (!username.trim()) {
      toast({
        title: 'Username required',
        description: 'Please enter your username to proceed',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setLoading(true)
      
      if (action === 'like') {
        await likesApi.like(postId, { username })
        toast({
          title: 'Post liked!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      } else {
        await likesApi.unlike(postId, { username })
        toast({
          title: 'Post unliked',
          status: 'info',
          duration: 2000,
          isClosable: true,
        })
      }
      
      // Refresh the post data
      if (onLikeChange) {
        onLikeChange()
      }
      
      onClose()
      setUsername('')
    } catch (error) {
      console.error('Failed to update like:', error)
      toast({
        title: `Failed to ${action} post`,
        description: handleApiError(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const openModal = (action) => {
    setActionType(action)
    onOpen()
  }

  return (
    <>
      <Button
        leftIcon={<FaRegHeart />}
        onClick={() => openModal('like')}
        colorScheme="red"
        variant="outline"
        size="sm"
      >
        Like
      </Button>
      
      <Button
        leftIcon={<FaHeart />}
        onClick={() => openModal('unlike')}
        colorScheme="red"
        variant="solid"
        size="sm"
      >
        Unlike
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {actionType === 'like' ? 'Like Post' : 'Unlike Post'}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLikeAction(actionType)
                    }
                  }}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={() => handleLikeAction(actionType)}
              isLoading={loading}
            >
              {actionType === 'like' ? 'Like' : 'Unlike'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default LikeButton