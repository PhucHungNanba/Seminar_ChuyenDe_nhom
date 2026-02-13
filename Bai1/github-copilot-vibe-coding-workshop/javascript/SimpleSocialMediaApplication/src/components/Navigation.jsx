import { HStack, Button, Spacer } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()

  return (
    <HStack w="100%" spacing={4} p={4} borderBottom="1px" borderColor="gray.200">
      <Button
        as={Link}
        to="/"
        variant={location.pathname === '/' ? 'solid' : 'ghost'}
        colorScheme="blue"
      >
        All Posts
      </Button>
      
      <Button
        as={Link}
        to="/create"
        variant={location.pathname === '/create' ? 'solid' : 'ghost'}
        colorScheme="green"
      >
        Create Post
      </Button>
      
      <Spacer />
    </HStack>
  )
}

export default Navigation