import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {
    Avatar,
    Box, Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia, Divider, Drawer,
    IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Stack,
    Typography
} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {red} from "@mui/material/colors";
import Image from "../components/image/Image";
import {useNavigate} from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {CardItemContext} from "../contexts/CardItemsContext";
import ModeEditIcon from '@mui/icons-material/ModeEdit';

const FoodList = () => {
    const [foods, setFoods] = useState([])
    const [showDescription, setShowDescription] = useState(false)
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const isAuthenticated = JSON.parse(localStorage.getItem('user')) ? true : false;
    const {
        cardItems,
        setCardItems,
        addToCardItems,
        reduceFromCardItems,
        deleteFromCardItems
    } = useContext(CardItemContext)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('/food/all/')
            .then(response => response.data)
            .then(result => setFoods(result.map(food =>
                ({
                    id: food.id,
                    name: food.name,
                    price: food.price,
                    description: food.description,
                    available: food.available,
                    image: food.image,
                    category: food.category,
                    cardCount: cardItems.reduce((counter, {name}) => name === food.name ? counter += 1 : counter, 0),
                    showDescription: false,
                }))))
            .catch(e => console.log(e))
    }, [])

    const toggleDrawer = (anchor, open, food) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [anchor]: open});

        if (food) {
            if (cardItems.some(value => {
                return value.name === food.name
            })) {
                const newState = cardItems.map(item => {
                    if (item.name === food.name) {
                        return {...item, cardCount: item.cardCount + 1};
                    }
                    return item
                });

                setCardItems(newState);
            } else {
                setCardItems(prevState => [...prevState, {...food, cardCount: 1}])
            }
        }
    }

    const checkoutHandler = () => {
        navigate('/card/')
    }

    const showFoodDescription = (index) => {
        let foodArr = [...foods];
        foodArr[index].showDescription = true;
        setFoods(foodArr);
    }

    const hideFoodDescription = (index) => {
        let foodArr = [...foods];
        foodArr[index].showDescription = false;
        setFoods(foodArr);
    }

    const styles = {
        media: {
            // height: 0,
            // paddingTop: '56.25%' // 16:9
        },
        card: {
            position: 'relative',
        },
        overlay: {
            position: 'absolute',
            top: '100px',
            left: '20px',
            color: 'black',
            backgroundColor: 'gray'
        }
    }


    return (
        <Stack sx={{padding: '5rem'}} spacing={3} direction="row" useFlexGap flexWrap="wrap">
            {foods.map((food, index) => (
                <Card sx={{maxWidth: 345}} key={food.name}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{bgcolor: red[500]}} aria-label="recipe">
                                {food.name[0]}
                            </Avatar>
                        }
                        title={food.name}
                        subheader={food.category.join('--')}
                    />
                    <Box sx={{position: 'relative'}}
                         onMouseOver={() => showFoodDescription(index)}
                         onMouseLeave={() => hideFoodDescription(index)}>
                        <CardMedia
                            component="img"
                            height="194"
                            image={food.image}
                            alt={food.name}
                            style={styles.media}
                        />
                        {food.showDescription &&
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '95%',
                                    height: '90%',
                                    bgcolor: 'rgba(0, 0, 0, 0.54)',
                                    color: 'white',
                                    padding: '10px',
                                }}
                            >
                                <Typography variant="p">{food.description}</Typography>
                            </Box>
                        }
                    </Box>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {food.price.toLocaleString()} $
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton aria-label="add" onClick={toggleDrawer('left', true, food)}>
                            <AddBoxIcon/>
                        </IconButton>
                        {isAuthenticated &&
                            <IconButton aria-label='edit' onClick={() => navigate('/food/edit/', {state: food})}>
                                <ModeEditIcon/>
                            </IconButton>
                        }
                    </CardActions>
                </Card>
            ))}

            <div>
                <Drawer
                    anchor='left'
                    open={state['left']}
                    onClose={toggleDrawer('left', false)}
                >
                    <Box
                        sx={{width: 350}}
                        role="presentation"
                    >
                        <List>
                            {cardItems.map((food, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Image address={food.image} title={food.name} height='45px'
                                                   width='45px'></Image>
                                        </ListItemIcon>
                                        <ListItemText primary={food.name + ' --- count: ' + food.cardCount}/>
                                        <ListItemIcon>
                                            <AddCircleOutlineIcon onClick={() => addToCardItems(food)}/>
                                            {food.cardCount > 1 &&
                                                <RemoveCircleOutlineIcon onClick={() => reduceFromCardItems(food)}/>}
                                            {food.cardCount === 1 &&
                                                <DeleteOutlineIcon onClick={() => deleteFromCardItems(food)}/>}
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        <Divider/>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        total:
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={cardItems.map(food => food.price * food.cardCount).reduce((a, b) => a + b, 0).toLocaleString()}/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                        <Divider/>
                    </Box>
                    <Button sx={{textAlign: 'center', marginX: 'auto', marginY: '15px'}}
                            variant="contained"
                            color="success"
                            onClick={checkoutHandler}>Checkout</Button>
                </Drawer>
            </div>
        </Stack>
    )
}

export default FoodList;
