import { AppBar, Container, Toolbar, Link, Button, Typography, Box } from "@mui/material";
import { SignIn } from '@clerk/nextjs'


export default function SignUpPage()
{
    return (
        <Box  sx={{backgroundColor: '#081C15', color: '#D8F3DC'}} padding={2} minHeight={'100vh'} minWidth={"100vw"}>
            <Container maxWidth="sm">

            <AppBar position="static" sx={{backgroundColor: "#081C15", mt: 1}} >
                <Toolbar > 
                    <Typography variant="h6" sx={{
                        flexGrow: 1
                    }}>
                       
                        Quiz Flashcard Saas
                    </Typography>
                
                    <Button color='inherit' href="/">
                    Home
                </Button>
                    <Button color='inherit' href="/sign-up">
                    Signup
                </Button>

                <Button color='inherit' href="/sign-in">
                Sign in
                </Button>
                </Toolbar>
            </AppBar>

            <Box display='flex' flexDirection="column" alignItems='center' justifyContent='center' paddingTop={"10px"} backgroundColor="#1B4332" sx={{p:2, mt: 3}}>
                    <Typography variant='h4'>
                        Signin
                    </Typography>
                    <SignIn   />
            </Box>
            </Container>
        </Box>
    )
}