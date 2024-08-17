'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import getStripe from "@/utils/get-stripe"
import { useSearchParams } from "next/navigation"
import { CircularProgress, Container, Typography, Box, Button } from "@mui/material"

const ResultPage = ()=> {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)
    const rounter = useRouter()
  

    useEffect(() => {
        const fetchCheckoutSession = async () => {
          if (!session_id) return
          try {
            const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
            const sessionData = await res.json()
            if (res.ok) {
              setSession(sessionData)
            } else {
              setError(sessionData.error)
            }
          } catch (err) {
            setError('An error occurred while retrieving the session.')
          } finally {
            setLoading(false)
          }
        }
        fetchCheckoutSession()
      }, [session_id])

      if (loading) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <CircularProgress style={{ color: 'green' }}
  size={60} />
            <Typography variant="h6" sx={{mt: 2}}>
              Loading...
            </Typography>
          </Container>
        )
      }

      if (error) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Container>
        )
      }

      return (
<Box 
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
  sx={{ backgroundColor: "#081C15" }}
  minHeight="100vh"
>  
      <Container maxWidth="sm" sx={{ backgroundColor:'#95D5B2', p:10, textAlign:'center', borderRadius: 6}}>
          {session.payment_status === 'paid' ? (
            <>
              <Typography variant="h3">Thank you for your purchase!</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="h6">Session ID: {session_id}</Typography>
                <Typography variant="body1">
                  We have received your payment. You will receive an email with the
                  order details shortly.
                </Typography>
                <Button href="/" sx={{backgroundColor:'#2D6A4F', color:'white', mt:5}}>Return Home</Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h3">Payment failed</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body1">
                  Your payment was not successful. Please try again Later.
                </Typography>
                <Button href="/" sx={{backgroundColor:'#2D6A4F', color:'white', mt:5}}>Return Home</Button>
              </Box>
            </>
          )}
        </Container>
        </Box>
      )
    }
export default ResultPage