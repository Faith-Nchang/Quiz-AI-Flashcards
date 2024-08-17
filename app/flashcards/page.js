// 'use client';

// import { useUser } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import { collection , doc, getDoc, setDoc} from "firebase/firestore";
// import { useRouter } from "next/navigation";
// import { CardContent, Typography , Container, Grid, CardActions, CardActionArea} from "@mui/material";
// import db from "@/firebase";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




// export default function Flashcards()
// {
//     const {isLoaded, isSignedIn, user} =  useUser()

//     const [flashcards, setFlashcards] = useState([]);
//     const router = useRouter()
//     const userName = user.fullName || user.firstName || user.lastName || "User";


//     useEffect(() => {
//         async function getFlashcards() {
//             if (!user){
//                 return 
//             }
//             const docRef = doc(collection(db, 'users'), user.id)
//             const docSnap = await getDoc(docRef)
//             if (docSnap.exists())
//             {
//                 const collections = docSnap.data().flashcards || []
//                 setFlashcards(collections)
//             }
//             else{
//                 await setDoc(docRef, {flashcards: []})
//             }
//         }
//         getFlashcards()
//     }, [user])

//     if (!isLoaded || !isSignedIn)  {
//         return <></>
//     }

//     const handleCardClick = (id) => {
//        router.push(`/flashcard?id=${id}`)
//     }

//     return (
//     <Container maxWidth="100vw" minHeight='100vh' sx={{backgroundColor: '#081C15', color:'white'}} >
//         <AppBar position="static" sx={{backgroundColor: "#142C21", height: 80, justifyContent: 'center'}}>
//         <Toolbar>
//           <Typography variant="h4" style={{flexGrow: 1}}> 
//               Career Flashcard Saas
//           </Typography>

//           <SignedOut>
//             {router.push('/')}
//           </SignedOut>

//           <SignedIn>
//             <UserButton />
//           </SignedIn>

//         </Toolbar>
//       </AppBar>

//       <Typography variant="h1" sx={{color: '#D8F3DC', p:5}} textAlign={'center'}  >
//             Welcome, {userName}!
//         </Typography>

//         <Grid container spacing={3} sx={{mt:4}}>
//             <Grid item xs={12} sm={6} md={4} key={index}>
//                         <Card>
//                             <CardActionArea onClick={() => {handleCardClick(id)}}>
                            
//                                 <CardContent sx={{background: '#2D6A4F'}}>
//                                     <Typography variant="h6">
//                                          Generate Flashcard
//                                     </Typography>
//                                     <Typography variant="h1">
//                                          +
//                                     </Typography>
//                                 </CardContent>
//                             </CardActionArea>
//                         </Card>
//             </Grid>

//             {flashcards.map((flashcard, index) =>(
//                 <Grid item xs={12} sm={6} md={4} key={index}>
//                     <Card>
//                         <CardActionArea onClick={() => {handleCardClick(id)}}>
                        
//                             <CardContent sx={{background: '#2D6A4F'}}>
//                                 <Typography variant="h6">
//                                     {flashcard.name}
//                                 </Typography>
//                                 <FontAwesomeIcon icon="fa-regular fa-trash-can" />
//                             </CardContent>
//                         </CardActionArea>
//                     </Card>
//                 </Grid>
//             ))}
//         </Grid>
//     </Container>)
// }

'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, CardContent, Typography,TextField, Container, Grid, CardActions, CardActionArea, Card, Box, Button } from "@mui/material";
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import db from "@/firebase";
// import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter()
  
    const userName = user?.fullName || user?.firstName || user?.lastName || "User";

   
    useEffect(() => {
        async function getFlashcards() {
          if (!user) 
          {
           return
          }
          const docRef = doc(collection(db, 'users'), user.id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            setFlashcards(collections)
            console.log(flashcards)
          } else {
            await setDoc(docRef, { flashcards: [] })
          }
        }
        getFlashcards()
      }, [user])

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    }

    const handleGenerate = () =>{
        router.push('/generate');
    }

    // search for flashcards
    const filteredFlashcards = flashcards.filter(flashcard =>
        flashcard.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
  
    if (isLoaded && !isSignedIn) {
        router.push('/');
    }

   

    return (
        <Box maxWidth={'100vw'} minHeight='100vh' sx={{ backgroundColor: '#081C15', color: 'white' }}>
            <AppBar position="static" sx={{ backgroundColor: "#142C21", height: 80, justifyContent:'center', p:2}}>
            <Toolbar sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between',alignItems:'center' }}>
        <Typography variant="h4" sx={{ flexShrink: 0 }}>
            Quiz Flashcard Saas
        </Typography>
        <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            label='Search Flashcards'
            variant='outlined'
            fullWidth
            sx={{ 
                color: 'white', 
                flexGrow: 0, 
                mx: 2,
               '& .MuiInputBase-root': {
            color: 'white', // Text color
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#D8F3DC', // Border color
            },
            '&:hover fieldset': {
                borderColor: '#D8F3DC', // Border color on hover
            },
            '&.Mui-focused fieldset': {
                borderColor: '#D8F3DC', // Border color when focused
            },
        },
        '& .MuiInputLabel-root': {
            color: 'white', // Label color
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: 'white', // Label color when focused
        },
    }}
        />
        <SignedIn>
            <UserButton sx={{ flexShrink: 0 }} />
        </SignedIn>
    </Toolbar>
            </AppBar>

            <Typography variant="h3" sx={{ color: '#D8F3DC', p: 5 }} textAlign={'center'}>
                Welcome, {userName}!
              
            </Typography>
           

            <Grid container spacing={3} sx={{ mt: 4, p: 4 }}>
    <Grid item xs={12} sm={6} md={4}>
        <Card>
            <CardActionArea onClick={handleGenerate}>
                <CardContent sx={{ background: '#2D6A4F', color: 'white', textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h5">
                        Generate Flashcard
                    </Typography>
                    <Typography variant="h1">
                        +
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    </Grid>

    {filteredFlashcards.map((flashcard, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent sx={{ background: '#2D6A4F', color: 'white', textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                        <Typography variant="h4">
                            {flashcard.name}
                        </Typography>
                        <Box 
                            sx={{ 
                                position: 'absolute', 
                                bottom: 16, 
                                right: 16 ,
                            }}
                        >
                          
                        </Box>
                        
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    ))}
</Grid>

        </Box>
    );
}
