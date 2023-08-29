import React, {useState} from "react";
export const CardItemContext = React.createContext()

const CardItemContextProvider = (props) => {
    const [cardItems, setCardItems] = useState([])

    const addToCardItems = (food) => {
        setCardItems(cardItems.map(item => {
            if (item.name === food.name) {
                return {...item, cardCount: item.cardCount + 1};
            }
            return item
        }))
    }

    const reduceFromCardItems = (food) => {
        setCardItems(cardItems.map(item => {
            if (item.name === food.name) {
                return {...item, cardCount: item.cardCount - 1};
            }
            return item
        }))
    }

    const deleteFromCardItems = (food) => {
        setCardItems(cardItems.filter(item => item.name !== food.name))
    }

    return (
        <CardItemContext.Provider value={{cardItems, setCardItems, addToCardItems, reduceFromCardItems, deleteFromCardItems}}>
            {props.children}
        </CardItemContext.Provider>
    )
}

export default CardItemContextProvider;