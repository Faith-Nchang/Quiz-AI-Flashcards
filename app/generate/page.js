'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Card,AppBar, Toolbar, CardActionArea, CircularProgress, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Typography, Grid, TextField } from "@mui/material";
import db from "@/firebase";
import { doc, deleteDoc, writeBatch, collection, getDoc } from "firebase/firestore";
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';



import { useUser } from "@clerk/nextjs";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const router = useRouter();

   

    if (isLoaded && !isSignedIn) {
        router.push('/');
      }
    
    const handleSubmit = async () => {
        // ensures the user inputs a text
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.')
            return
          }
          setLoading(true)
          try {
            const response = await fetch('/api/generate', {
              method: 'POST',
              body: text,
            })
        
            if (!response.ok) {
              throw new Error('Failed to generate flashcards')
            }
        
            const data = await response.json()
            setFlashcards(data)
          } catch (error) {
            console.error('Error generating flashcards:', error)
            alert('An error occurred while generating flashcards. Please try again.')
          
       }finally {
        setLoading(false); // Set loading to false when the function completes
      }
    };
    

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert("Your flashcard collection with the same name already exists");
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const columnRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(columnRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

 
    // Process the file and update the text field
    const handleFileUpload = () => {
        if (!file) return;
        processTextFile(file);
        if (file.type.includes('text')) {
            processTextFile(file);
        } else if (file.type.includes('presentation')) {
            processPptxFile(file);
        } else {
            alert('Unsupported file type');
        }
    };

    // Process text file content
    const processTextFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileData = event.target.result;
            setText(fileData);
        };
        // reader.readAsText(file);
    };

    

    return (
        <Box minWidth="100%" minHeight='100vh' sx={{ backgroundColor: '#081C15', color:'white'}}>
            <AppBar position="static" sx={{ backgroundColor: "#142C21", height: 80, justifyContent: 'center',mb:3 }}>
                <Toolbar>
                    <Typography variant="h4" sx={{ flexGrow: 1 }}>
                        Quiz Flashcard Saas
                    </Typography>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>

            
            <Container maxWidth='sm' sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant='h4'>Generate Flashcards</Typography>
                <Paper sx={{ p: 4, width: '100%', mt:2 }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label='Enter Topic'
                        fullWidth
                        multiline
                        rows={4}
                        variant='outlined'
                        sx={{ mb: 2}}
                    />
                    <Box display='flex' flexDirection='row' alignItems={'center'} justifyContent={'center'}>
                        
                            <Button variant="contained" color="primary" sx={{ mt: 2, backgroundColor: "#003B2C", mr:1 }} fullWidth onClick={handleSubmit}>
                                Submit
                            </Button>
                     
                </Box>
                </Paper>
            </Container>
            { isLoading && (
                    <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
                         <CircularProgress style={{ color: 'green' }}
                            size={60} />
                        <Typography variant="h6" sx={{mt: 2, color:'white'}}>
                        Loading...
                        </Typography>
                    </Container>
            )
            }
            
            {flashcards.length > 0 && (
                <Box sx={{ mt: 6 , p:5}}>
                    <Typography variant='h4' textAlign={'center'} sx={{pb:3}}>Flashcards Preview</Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent sx={{backgroundColor:'#2D6A4F'}}>
                                            <Box sx={{
                                                perspective: "1000px",
                                                '& > div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: "100%",
                                                    height: '300px',
                                                    boxShadow: '0 0.5px 2px 0 rgba(0, 0, 0, 0.1)',
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant='contained'  sx={{ mt: 2, backgroundColor: "#2D6A4F", color: 'white' }} onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}
            <Dialog open={open} onClose={handleClose} >
                <DialogTitle sx={{color: '#52B788'}}>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin='dense'
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant='outlined'
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{backgroundColor:'#40916C', color:'black'}}>Cancel</Button>
                    <Button onClick={saveFlashcards} sx={{backgroundColor:'#40916C', color:'black'}}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
