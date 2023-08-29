import React, {useContext, useEffect} from 'react'
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {OrderContext} from "../contexts/OrderContext";

const PaymentGateway = () => {
    const navigate = useNavigate()
    const {order} = useContext(OrderContext)
    useEffect(() => {
        console.log('order: ', order)
    }, [])
    return(
        <div style={{textAlign: 'center'}}>
            <h2>Payment Gateway</h2>

            <Button variant='contained' color='success' onClick={() => navigate('/checkout/', {state: {status: 'success'}})}>Success</Button>
            <Button variant='contained' color='error' onClick={() => navigate('/checkout/', {state:{status: 'fail', errorMessage:'There is a problem with payment! try again.'}})}>Fail</Button>
        </div>
    )
}

export default PaymentGateway;