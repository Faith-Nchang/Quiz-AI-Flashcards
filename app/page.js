'use client';

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { AppBar, Toolbar, Typography, Container, Button , Box, Grid } from "@mui/material";
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faMagnifyingGlass, faUniversalAccess } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser()

  const username = user?.username || 'Guest';

  const handleSubmit = async (amount) => {
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000',
        },
        body: JSON.stringify({ amount }), // Send the amount to the API
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const checkoutSessionJson = await response.json();
  
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }
  
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });
  
      if (error) {
        console.warn('Stripe Checkout Error:', error.message);
      }
    } catch (error) {
      console.error('Error during checkout process:', error);
    }
  };
  
  // if (isSignedIn) {
  //   router.push('/flashcards')
  // }

  return (
    <Box maxWidth='100vw' minHeight='100vh' sx={{ backgroundColor: '#081C15', color: '#D8F3DC', margin:0, p:0}}>
      <Head>
        <title>Quiz Flashcard Saas</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static" sx={{ backgroundColor: "#142C21", height: 80, justifyContent: 'center' }}>
        <Toolbar>
          <Typography variant="h4" style={{ flexGrow: 1 }}>
            Quiz Flashcard Saas
          </Typography>

          <SignedOut>
            <Button  variant="outlined"  href="/sign-in" sx={{backgroundColor: "#2D6A4F", color:'white', marginRight:5}}>
              Login
            </Button>
            <Button variant="outlined" href='/sign-up' sx={{backgroundColor: "#2D6A4F", color:'white'}}>
              Signup
            </Button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

        </Toolbar>
      </AppBar>
      <Box justifyContent={'center'} alignContent={'center'}  sx={{
        backgroundImage: 'url(https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        animation: 'moveBackground 30s linear infinite',
        
      }}>
      <Box textAlign={'center'} color='white'>
        
        <SignedOut>
        <Typography variant="h1">Welcome to Quiz Flashcards</Typography>
        <Typography variant="h5">The easiest ways to make flash cards from scratch</Typography>
          <Button variant="outlined" color="primary" sx={{ mt: 2, backgroundColor: "#003B2C", color:'white' }} href="/sign-up">
            Get started
          </Button>
        </SignedOut>

        <SignedIn>
        <Typography variant="h1">Hi {username}!</Typography>
        <Typography variant="h5">Are your ready to  easily  make flash cards from scratch using AI</Typography>
          <Button variant="contained" sx={{ mt: 2, backgroundColor: "#003B2C", color: 'white' }} href="/flashcards">
            Access your Flashcards
          </Button>
        </SignedIn>
      </Box>
      </Box>
      <Box  sx={{backgroundColor:'white', color:'#2D6A4F', alignItems:'center', justifyContent:'center', p:5}} >
        <Typography variant="h2" textAlign={'center'} mb={2}>
          Features
        </Typography>

        <Grid container spacing={4} padding={2} textAlign={'center'} >
          <Grid item xs={12} sm={6} md={4}>
            <FontAwesomeIcon icon={faKeyboard} size='3x' style={{ margin: '25px' }}/>
            <Typography variant='h4' marginBottom={2}>
              Easy Text Input
            </Typography>
            <Typography variant='h6' >
              Simply input your text and let our software do the rest. Creating flashcards has never been easier
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size='3x' style={{ margin: '25px' }}/>
            <Typography variant='h4' marginBottom={2}>
              Search Flashcards
            </Typography>
            <Typography variant='h6'>
              Our AI intelligently breaks down your text into concise flashcards, perfect for studying
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FontAwesomeIcon icon={faUniversalAccess} size='3x' style={{ margin: '25px' }} />
            <Typography variant='h4' marginBottom={2}>
              Accessible Anywhere
            </Typography>
            <Typography variant='h6'>
              Access your flashcards from any device. Study on the go with these
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box my={6} textAlign={'center'}>
        <Typography variant="h2" textAlign={'center'} mb={2}>
          Pricing
        </Typography>

        <Grid container spacing={4} padding={2} justifyContent={'center'} alignContent={'center'}>
        <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                backgroundColor: '#1B4332',
                borderRadius: 3,
                height: 400,
              }}
              justifyContent={'center'} alignContent={'center'}
            >
              <Typography variant='h4' mb={5}>
                Free
              </Typography>
              <Typography variant='h5' color={'#95D5B2'}>
                Free trial for a month
              </Typography>
              <Typography variant='h6' mb={5}>
                Explore how the platforms work
              </Typography>

              <Button sx={{ backgroundColor: '#2D6A4F', color: 'white' }} href='/sign-up'>
                Free
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                backgroundColor: '#1B4332',
                borderRadius: 3,
                height: 400,
              }}
              justifyContent={'center'} alignContent={'center'}
            >
              <Typography variant='h4' mb={5}>
                Basic
              </Typography>
              <Typography variant='h5' color={'#95D5B2'}>
                $5 per month
              </Typography>
              <Typography variant='h6' mb={5}>
                Access to basic card features and limited storage
              </Typography>
              <SignedIn>
              <Button sx={{ backgroundColor: '#2D6A4F', color: 'white' }} onClick={() => handleSubmit(5)}>
                Choose Basic
              </Button>
              </SignedIn>

              <SignedOut>
                <Button sx={{ backgroundColor: '#2D6A4F', color: 'white' }} href="/sign-in">
                  Signin to pay
                </Button>
              </SignedOut>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                backgroundColor: '#1B4332',
                borderRadius: 3,
                height: 400,
              }}
              justifyContent={'center'} alignContent={'center'}
            >
              <Typography variant='h4' mb={5}>
                Pro
              </Typography>
              <Typography variant='h5' color={'#95D5B2'}>
                $10 per month
              </Typography>
              <Typography variant='h6' mb={5}>
                Unlimited flashcard and storage with priority support
              </Typography>
              <SignedIn>
              <Button sx={{ backgroundColor: '#2D6A4F', color: 'white' }} onClick={() => handleSubmit(10)}>
                Choose Pro
              </Button>
              </SignedIn>

              <SignedOut>
                <Button sx={{ backgroundColor: '#2D6A4F', color: 'white' }} href="/sign-in">
                  Signin to pay
                </Button>
              </SignedOut>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{p:5, textAlign:"center"}}>
        <Typography>
        © 2024 Faith Nchang. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
