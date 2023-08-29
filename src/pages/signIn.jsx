import React, {useContext, useEffect, useState} from "react";
import {
    Button, Checkbox, Chip,
    Container,
    FormControl,
    Grid, IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Image from "../components/image/Image";
import SignInImage from '../assets/images/signIn.jpg'
import ReloadImage from '../assets/images/reload.png'
import axios from "axios";
import Cookies from 'js-cookie';
import {pink} from "@mui/material/colors";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";


const SignIn = () => {
    const label = {inputProps: {'aria-label': 'Checkbox demo'}};

    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [randomNum1, setRandomNum1] = useState(0)
    const [randomNum2, setRandomNum2] = useState(0)
    const [sum, setSum] = useState(0)
    const [inputValue, setInputValue] = useState(0)
    const [errorExistence, setErrorExistence] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [loginOperation, setLoginOperation] = useState(true)

    const {authenticated, token, login} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        if (authenticated) {
            navigate('/food/all/', {replace: true})
        }
        generateRandomNum()
    }, [])

    const generateRandomNum = () => {
        let rand1 = Math.floor(Math.random() * 10) + 1
        let rand2 = Math.floor(Math.random() * 10) + 1
        setRandomNum1(rand1)
        setRandomNum2(rand2)
        setSum(rand1 + rand2)
    }

    const validateAndSignIn = () => {
        if (sum !== inputValue) {
            setErrorExistence(true)
            setErrorMessage('Captcha Invalid!')
        } else {
            setErrorExistence(false)
            if (loginOperation) {
                axios.post('/api/users/login/', {user: {phone_number: phoneNumber, password: password}})
                    .then(res => res.data)
                    .then(response => {
                        login(response.user.user.token, {
                            email: response.user.user.email,
                            phone_number: response.user.user.phone_number,
                            address: JSON.parse((response.user.user.address).replace(/'/g, '"')),
                        })
                        navigate('/food/all/', {token: token})
                    })
                    .catch((e) => {
                        setErrorExistence(true)
                        errorHandler(e)
                    })
            } else {
                axios.post(
                    'api/users/signup/',
                    {user: {
                        email: email,
                            phone_number: phoneNumber,
                            password: password
                    }},
                    {
                        headers: {
                            'X-CSRFToken': Cookies.get('csrftoken')
                        }
                    }
                )
                    .then(response => response.data)
                    .then(result => setLoginOperation(true))
                    .catch(e => {
                        setErrorExistence(true)
                        errorHandler(e)
                    })
            }
        }
    }

    const errorHandler = (e) => {
        if (e.response.data.user.email) setErrorMessage('Email Wrong! ' + e.response.data.user.email[0])
        else if (e.response.data.user.phone_number) setErrorMessage('phone_number Wrong! ' + e.response.data.user.phone_number[0])
        else if (e.response.data.user.password) setErrorMessage('Password Wrong! ' + e.response.data.user.password[0])
        else if (e.response.data.user.non_field_errors) setErrorMessage(e.response.data.user.non_field_errors[0])
        else setErrorMessage('sth went wrong!')
    }


    return (
        <Container>
            <Grid container alignContent='center' justifyContent='center' sx={{margin: 'auto'}}>
                <Grid item>
                    <div style={{marginTop: '75px', textAlign: 'center', width: 380, height: 380}}>
                        <Image title='signIn' address={SignInImage}></Image>
                    </div>
                </Grid>
                <Grid item xs={12} sm container sx={{
                    marginY: '75px',
                    padding: '2rem',
                    justifyContent: 'center',
                    border: 'medium dashed blue'
                }}>
                    <Stack spacing={2} justifyContent="center" alignItems="center">
                        <h2>{loginOperation ? 'Login' : 'SignUp'}</h2>
                        {errorExistence && <Chip label={errorMessage} color="error"/>}
                        <TextField sx={{width: '25ch'}} id="outlined-basic" label="Email" type='email'
                                   variant="outlined"
                                   onChange={(event) => setEmail(event.target.value)}/>

                        {!loginOperation &&
                            <TextField sx={{width: '25ch'}} id="outlined-basic" label="Phone Number" type='text'
                                       variant="outlined"
                                       onChange={(event) => setPhoneNumber(event.target.value)}/>}

                        <FormControl sx={{m: 1, width: '25ch'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                onChange={(event) => setPassword(event.target.value)}
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                        <Stack spacing={1} direction='row'>
                            <p>{randomNum1} + {randomNum2} = </p>
                            <TextField sx={{width: '10ch'}}
                                       onChange={(event) => setInputValue(Number(event.target.value))}></TextField>
                            <Image width='40px' height='40px' address={ReloadImage} title='reload'
                                   onClick={() => generateRandomNum()}></Image>
                        </Stack>
                        <Button variant="contained" color="success" onClick={validateAndSignIn} sx={{width: '30ch'}}>
                            Login
                        </Button>

                        <Stack spacing={1} direction='row'>
                            <p>I have not an account</p>
                            <Checkbox
                                {...label}
                                onChange={() => setLoginOperation(!loginOperation)}
                                value={loginOperation}
                                sx={{
                                    color: pink[800],
                                    '&.Mui-checked': {
                                        color: pink[600],
                                    },
                                }}
                            />
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    )
}

export default SignIn;