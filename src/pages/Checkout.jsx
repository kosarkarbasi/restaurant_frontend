import React, {useContext, useEffect, useState} from "react";
import {
    Backdrop,
    Box,
    Button, CircularProgress, FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Stack, Tab,
    TextareaAutosize
} from "@mui/material";
import CardItemsTable from "../containers/CardItemsTable";
import {useLocation, useNavigate} from "react-router-dom";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import AddIcon from '@mui/icons-material/Add';
import {TabPanel} from "@mui/lab";
import Image from "../components/image/Image";
import SamanLogo from '../assets/images/saman.png'
import ParsianLogo from '../assets/images/parsian.png'
import axios from "axios";
import {CardItemContext} from "../contexts/CardItemsContext";
import {OrderContext} from "../contexts/OrderContext";
import {AuthContext} from "../contexts/AuthContext";
import AddressForm from "../containers/addressForm";

const Checkout = () => {
    const [description, setDescription] = useState('')
    const [deliveryType, setDeliveryType] = useState('send')
    const [address, setAddress] = useState('')
    const [creditCardPort, setCreditCardPort] = useState('saman')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [value, setValue] = useState('1');
    const [submitted, setSubmitted] = useState(false)
    const [openAddressDialog, setOpenAddressDialog] = useState(false)

    const {cardItems} = useContext(CardItemContext);
    const {order, setOrder} = useContext(OrderContext);
    const {authenticated, userInfo, login} = useContext(AuthContext)

    const handlePaymentMethodChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === '1') setPaymentMethod('online')
        else if (newValue === '2') setPaymentMethod('cash')
        else if (newValue === '3') setPaymentMethod('cardReader')
    };
    const navigate = useNavigate()
    const location = useLocation()

    const saveOrder = () => {
        setOrder({
            address,
            description,
            delivery_type: deliveryType,
            order_items: cardItems.map(item => ({
                food: item.name,
                quantity: item.cardCount
            })),
            payments: {
                method: paymentMethod,
                status: (location.state ? location.state.status : 'loading'),
                bank_gateway: (value === '1' ? creditCardPort : '')
            }
        })
    }

    const submit = () => {
        axios.post(
            '/order/create/',
            order
        )
            .then(response => response.data)
            .then(data => {
                setSubmitted(true)
                // setCardItems({})
            })
            .catch(error => setSubmitted(false))
    }

    useEffect(() => {
        axios.post(
            '/user/info/',
            {phone_number: userInfo.phone_number}
        )
            .then(response => response.data)
            .then(result => console.log(result))
    }, [openAddressDialog])

    useEffect(() => {
        if (cardItems.length === 0 || !authenticated) navigate('/food/all/', {replace: true})
        if (location.state) {
            if (location.state.status === 'success') submit()
            else setSubmitted(false)
        }
        if (submitted) setTimeout(() => navigate('/order/detail/', {replace: true}), 2000)
    }, [submitted])

    // useEffect(() => {
    //     if (authenticated) {
    //         const user = JSON.parse(localStorage.getItem('user'))
    //         login(user.token, user.userInfo)
    //     }
    // }, [])

    return (
        <Grid container spacing={6} sx={{padding: '30px', boxSizing: 'auto', paddingX: '100px'}}>
            {submitted &&
                <Grid item xs={1}>
                    <Backdrop
                        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                        open={submitted}
                    >
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                </Grid>
            }
            <Grid item xs={5}>
                <Stack sx={{backgroundColor: 'gray'}}>
                    <CardItemsTable/>
                    <Button variant="contained" color='secondary' onClick={() => navigate('/food/all/')}>
                        Back To Menu
                    </Button>
                </Stack>
            </Grid>

            <Grid item xs={6}>
                <Stack spacing={3} sx={{marginLeft: '150px'}}>
                    <Stack direction='row' spacing={3}>
                        <label>Description</label>
                        <TextareaAutosize minRows='7' onChange={(e) => setDescription(e.target.value)}/>
                    </Stack>

                    <Stack direction='row' spacing={3}>
                        <label>Delivery Type</label>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue={deliveryType}
                            name="radio-buttons-group"
                            onChange={(e) => setDeliveryType(e.target.value)}
                        >
                            <FormControlLabel value="send" control={<Radio/>} label="Send"/>
                            <FormControlLabel value="onPerson" control={<Radio/>} label="On Person"/>
                        </RadioGroup>
                    </Stack>

                    <Stack direction='row' spacing={3}>
                        <label>Address</label>

                        <FormControl>
                            {userInfo.address &&
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue={userInfo.address.filter(adr => adr.active === 'True')[0].pk}
                                    name="radio-buttons-group"
                                >
                                    {userInfo.address.map(userAddress => (
                                        <Stack spacing={3} key={userAddress.pk}>
                                            <FormControlLabel value={userAddress.pk}
                                                              control={<Radio/>}
                                                              label={userAddress.address} labelPlacement='end'/>
                                        </Stack>
                                    ))}
                                </RadioGroup>
                            }
                            <Button variant='contained' color='secondary' startIcon={<AddIcon/>}
                                    sx={{width: '40%', marginTop: '20px'}} onClick={() => setOpenAddressDialog(true)}>Add
                                New Address</Button>
                        </FormControl>
                    </Stack>

                    <AddressForm open={openAddressDialog} onClose={() => setOpenAddressDialog(false)}
                                 phoneNumber={userInfo.phone_number}/>

                    <Stack direction='row' spacing={3} sx={{width: '60%'}}>
                        <label>Payment Method</label>
                        <Box sx={{width: '100%', typography: 'body1'}}>
                            <TabContext value={value}>
                                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                    <TabList onChange={handlePaymentMethodChange} aria-label="lab API tabs example">
                                        <Tab label="Online" value="1"/>
                                        <Tab label="Cash" value="2"/>
                                        <Tab label="Card Reader" value="3"/>
                                    </TabList>
                                </Box>
                                <TabPanel value="1" index='1'>
                                    {location.state &&
                                        <p style={{color: 'red'}}>{location.state.errorMessage}</p>}
                                    <label>Please Select Bank Port:</label>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue={creditCardPort}
                                        name="radio-buttons-group"
                                        onChange={(e) => setCreditCardPort(e.target.value)}
                                    >
                                        <Stack direction="row" spacing={1}>
                                            <FormControlLabel value="saman" control={<Radio/>} label="Saman"/>
                                            <Image address={SamanLogo} width='50px' height='50px'/>
                                        </Stack>
                                        <Stack direction="row" spacing={1}>
                                            <FormControlLabel value="parsian" control={<Radio/>} label="Parsian"/>
                                            <Image address={ParsianLogo} width='50px' height='50px'/>
                                        </Stack>
                                        <Button variant="contained" color='success'
                                                onClick={() => {
                                                    saveOrder();
                                                    navigate('/pay/')
                                                }}>Pay</Button>
                                    </RadioGroup>
                                </TabPanel>
                                <TabPanel value="2" index="2">
                                    you selected to pay cash to delivery man.
                                    <br/>
                                    <Button variant='contained' color='warning' onClick={() => {
                                        saveOrder()
                                        submit()
                                    }}
                                            sx={{marginTop: '20px'}}>Submit</Button>
                                </TabPanel>
                                <TabPanel value="3" index="3">
                                    Delivery Man will carry card reader for you.
                                    <br/>
                                    <Button variant='contained' color='warning' onClick={() => {
                                        saveOrder();
                                        submit()
                                    }}
                                            sx={{marginTop: '20px'}}>Submit</Button>
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Checkout;