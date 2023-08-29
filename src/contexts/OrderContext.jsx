import React, {useState} from "react";

export const OrderContext = React.createContext()

const OrderContextProvider = (props) => {
    const [order, setOrder] = useState({})

    const updatePayment = (newValue) => {
        setOrder(order => {
            return {...order, payment: newValue};
        })
    }

    return (
        <OrderContext.Provider value={{order, setOrder, updatePayment}}>
            {props.children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;