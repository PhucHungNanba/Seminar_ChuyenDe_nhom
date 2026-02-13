import { useState, useEffect } from 'react'
import { Container, VStack, Heading, Alert, AlertIcon, Spinner, Text } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'
import CreatePost from './components/CreatePost'
import Navigation from './components/Navigation'
import { checkApiHealth } from './services/api'

function App() {
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    const checkApi = async () => {
      try {
        console.log('Checking API health...')
        await checkApiHealth()
        console.log('API is connected!')
        setApiStatus('connected')
      } catch (error) {
        console.error('API connection failed:', error)
        setApiStatus('disconnected')
      }
    }

    // Add a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.log('API check timeout, assuming disconnected')
      setApiStatus('disconnected')
    }, 5000)

    checkApi().finally(() => {
      clearTimeout(timeoutId)
    })
    
    // Check API status every 30 seconds
    const interval = setInterval(checkApi, 30000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeoutId)
    }
  }, [])

  if (apiStatus === 'checking') {
    console.log('App status: checking API...')
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4}>
          <Spinner size="lg" />
          <Text>Checking API connection...</Text>
        </VStack>
      </Container>
    )
  }

  console.log('App status:', apiStatus)
  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6}>
        <Heading>Simple Social Media</Heading>
        
        {apiStatus === 'connected' && (
          <Alert status="success">
            <AlertIcon />
            Backend API is running on http://localhost:8000
          </Alert>
        )}
        
        {apiStatus === 'disconnected' && (
          <Alert status="error">
            <AlertIcon />
            Backend API is unavailable. Please check if the server is running on http://localhost:8000
          </Alert>
        )}
        
        <Navigation />
        
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </VStack>
    </Container>
  )
}

export default App
