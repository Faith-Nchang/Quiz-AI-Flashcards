'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from 'firebase/firestore'
import db from "@/firebase"
import { useSearchParams } from "next/navigation"
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import { Box, AppBar, Toolbar, Card, CardActionArea, CardContent, Typography, Grid } from "@mui/material";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const [collectionName, setCollectionName] = useState('')

    const searchParams = useSearchParams()
    const search = searchParams.get('id')
    if (isLoaded && !isSignedIn) {
        router.push('/');
      }

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return

            setCollectionName(search)  // Store the collection name in state

            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }
   
    return (
        <Box maxWidth={'100vw'} minHeight='100vh' sx={{ backgroundColor: '#081C15', color: 'white' }}>
            <AppBar position="static" sx={{ backgroundColor: "#142C21", height: 80, justifyContent: 'center' }}>
                <Toolbar>
                    <Typography variant="h4" sx={{ flexGrow: 1 }}>
                        Quiz Flashcard Saas
                    </Typography>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>
            <Box sx={{p:5}}>
                <Typography variant="h3" textAlign={'center'}>
                    {collectionName}
                </Typography>
            {flashcards.length > 0 && (
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                <CardContent sx={{backgroundColor:'#2D6A4F'}}>                                        <Box sx={{
                                            perspective: "1000px",
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: "100%",
                                                height: '200px',
                                                boxShadow: '0 0.5px 2px 0 rgba(0, 0, 0, 0.1)',
                                                transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                            },
                                            '& > div > div': {
                                                position: 'absolute',
                                                width: "100%",
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: "flex",
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                            },
                                            '& > div > div:nth-of-type(2)': {
                                                transform: 'rotateY(180deg)',
                                            },
                                        }}>
                                                <div style={{ backgroundColor: "white" }}>
                                                <div>
                                                    <Typography variant="h5" component={'div'}>
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>

                                                <div>
                                                    <Typography variant="h5" component={'div'}>
                                                        {flashcard.back}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            </Box>
        </Box>
    )
}
