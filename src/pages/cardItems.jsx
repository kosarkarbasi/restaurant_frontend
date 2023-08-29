import React, {useContext, useEffect, useRef, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {
    Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    Stack,
    TextField
} from "@mui/material";
import {CardItemContext} from "../contexts/CardItemsContext";
import CardItemsTable from "../containers/CardItemsTable";
import {AuthContext} from "../contexts/AuthContext";
import {CheckUserExistence, LoginAction, SignupAction} from "../Query/Authentication";

const CardItems = () => {
    const [openPhoneBox, setOpenPhoneBox] = useState(false)
    const [openPasswordBox, setOpenPasswordBox] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [phoneNumberError, setPhoneNumberError] = useState(false)
    const [code, setCode] = useState('ASDF')
    const inputRefs = useRef([]);
    const [userCode, setUserCode] = useState([])
    const [errorCode, setErrorCode] = useState(false)
    const [userExist, setUserExist] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const navigate = useNavigate()

    const {authenticated, login, userInfo} = useContext(AuthContext)

    const {
        cardItems,
    } = useContext(CardItemContext)

    useEffect(() => {
        if (cardItems.length === 0) {
            navigate('/food/all/')
        }
    }, [cardItems])

    // useEffect(() => {
    //     console.log('userInfo: ', userInfo)
    //     if (authenticated && userInfo==null) {
    //         const user = JSON.parse(localStorage.getItem('user'))
    //         login(user.token, user.userInfo)
    //     }
    // }, [])

    const openPhoneDialogHandler = () => {
        if (authenticated === false) setOpenPhoneBox(true)
        else navigate('/checkout/')
    }

    const closeHandler = () => {
        // empty strings
        setPhoneNumber('')
        setPassword('')
        setUserCode([])

        // false all the trues
        setOpenPhoneBox(false)
        setOpenPasswordBox(false)
        setErrorCode(false)
        setUserExist(false)
        setPhoneNumberError(false)
        setPasswordError(false)
    }

    const inputRefHandler = (e, index) => {
        let codeArr = userCode
        codeArr[index] = e.target.value;
        setUserCode(codeArr)

        if (e.target.value.length === 1) {
            const nextIndex = index + 1
            if (nextIndex < code.length) {
                inputRefs.current[nextIndex].focus();
                inputRefs.current[nextIndex].value = ''
            }
        }
    }

    const checkPhoneExistence = () => {
        if (phoneNumber === '') {
            setPhoneNumberError(true)
        } else {
            CheckUserExistence(phoneNumber, function (exist) {
                setUserExist(exist)
                setOpenPasswordBox(true)
                setOpenPhoneBox(false)
            })
        }
    }

    const submitHandler = () => {
        if (userExist) {
            LoginAction(phoneNumber, password, function (response) {
                if (response.error) setPasswordError(true)
                else {
                    login(response.token, response.user)
                    navigate('/checkout/')
                }
            })
        } else {
            // check code --> if correct: signup and login
            //            --> if wrong: show error message for code
            if (userCode.join('') === code) {
                setErrorCode(false)
                SignupAction(phoneNumber, password, "CUSTOMER", function (signup) {
                    if (signup) {
                        LoginAction(phoneNumber, password, function (response) {
                            login(response.token, response.user)
                            navigate('/checkout/')

                        })
                    }
                })
            } else
                setErrorCode(true)
        }
    }

    return (
        <React.Fragment>
            <div style={{marginBottom: '30px', marginTop: '30px'}}>
                <CardItemsTable/>
            </div>
            <Stack spacing={3} direction='row' sx={{margin: 'auto', width: '400px'}}>
                <Button variant="contained" color="primary" size='medium'
                        onClick={openPhoneDialogHandler}>Checkout</Button>
                <Button variant="contained" color="secondary" size='medium'
                        onClick={() => navigate('/food/all/')}>Continue Shopping</Button>
            </Stack>
            {!authenticated &&
                <Dialog open={openPhoneBox} onClose={closeHandler}>
                    <DialogTitle>Enter Your Phone Number</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Phone Number"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        {phoneNumberError && <p style={{color: 'red'}}>please fill phone number</p>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeHandler}>Cancel</Button>
                        <Button onClick={checkPhoneExistence}>Check</Button>
                    </DialogActions>
                </Dialog>
            }


            <Dialog open={openPasswordBox} onClose={closeHandler}>
                <DialogTitle>Enter Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label={userExist ? "Password" : "Set a New Password"}
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <p style={{color: 'red'}}>Password Incorrect!</p>}

                    {!userExist &&
                        <div style={{padding: '2rem', marginTop: '10px'}}>
                            <Chip
                                label="sms sent"
                                color='success'
                                sx={{width: '100%'}}
                            />
                            <p>Please enter the code</p>
                            <Stack direction='row' spacing={1}>
                                {code.split('').map((char, index) => (
                                    <TextField key={index}
                                               inputProps={{maxlength: 1, style: {textAlign: 'center'}}}
                                               inputRef={(ref) => (inputRefs.current[index] = ref)}
                                               id="outlined-basic"
                                               variant="outlined"
                                               sx={{width: '50px', height: '20px'}}
                                               onChange={(e) => inputRefHandler(e, index)}
                                    />
                                ))}
                            </Stack>
                            <div style={{marginTop: '40px'}}>
                                {errorCode && <p style={{color: 'red'}}>wrong code!</p>}
                            </div>
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeHandler}>Cancel</Button>
                    <Button onClick={submitHandler}>Login</Button>
                </DialogActions>
            </Dialog>

        </React.Fragment>
    )
}

export default CardItems;