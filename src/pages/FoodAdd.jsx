import React, {useEffect, useState} from "react";
import {
    Alert, Backdrop,
    Button,
    Checkbox, CircularProgress,
    Container,
    FormControl, InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select, Stack, styled, Switch, switchClasses, TextareaAutosize,
    TextField
} from "@mui/material";
import axios from "axios";
import {blue, grey} from "@mui/material/colors";
import Image from "../components/image/Image";
import {useLocation, useNavigate} from "react-router-dom";

const FoodAdd = ({mode}) => {
    const [categoryList, setCategoryList] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [foodId, setFoodId] = useState(null)
    const [foodName, setFoodName] = useState('')
    const [foodPrice, setFoodPrice] = useState(0)
    const [foodImage, setFoodImage] = useState(null)
    const [foodImageUpdated, setFoodImageUpdated] = useState(false)
    const [foodDescription, setFoodDescription] = useState('')
    const [foodAvailable, setFoodAvailable] = useState(true)
    const [foodUpdated, setFoodUpdated] = useState(false)

    const label = {slotProps: {input: {'aria-label': 'Demo switch'}}};

    const navigate = useNavigate()
    const location = useLocation()


    const handleChange = (event) => {
        const value = event.target.value
        setSelectedCategories(typeof value === 'string' ? value.split(',') : value,);
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };


    useEffect(() => {
        axios.get('/category/all/')
            .then(response => response.data)
            .then(result => setCategoryList(result))
    }, [])

    useEffect(() => {
        if (mode === 'edit') {
            const food = location.state;
            setFoodId(food.id)
            setFoodName(food.name)
            setFoodPrice(food.price)
            setFoodAvailable(food.available)
            setFoodImage(food.image)
            setFoodDescription(food.description)
            setSelectedCategories(categoryList.filter((cat) => {
                return food.category.some((foodCat) => {
                    return foodCat === cat.name;
                })
            }))
        }
    }, [categoryList])

    const setFormData = () => {
        const formData = new FormData();
        formData.append("name", foodName);
        formData.append("price", foodPrice);
        formData.append("description", foodDescription);
        selectedCategories.forEach((cat) => formData.append("category", cat.name));
        foodImageUpdated && formData.append("image", foodImage);
        formData.append("available", foodAvailable);
        return formData;
    }

    const addFoodHandler = () => {
        const formData = setFormData()
        axios.post('/food/add/', formData)
            .then(response => response.data)
            .then(result => navigate('/food/all'))
    }

    const editFoodHandler = () => {
        const formData = setFormData()
        axios.put('/food/edit/' + foodId, formData)
            .then(response => response.data)
            .then(() => {
                setFoodUpdated(true);
                setTimeout(() => navigate('/food/all/', {replace: true}), 2000)
            })
    }

    return (
        <Container maxWidth='sm' sx={{textAlign: 'center', marginY: '5rem'}}>
            {foodUpdated &&
                <div>
                    <Alert severity="success">Food Updated Successfully!</Alert>
                    <Backdrop
                        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                        open={foodUpdated}
                    >
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                </div>
            }
            <h1>{mode === 'edit' ? 'Edit Food' : 'Add New Food'}</h1>
            <FormControl sx={{m: 1, width: 400}}>
                <Stack spacing={2}>
                    <TextField id="outlined-basic"
                               label="Name"
                               type='text'
                               variant="outlined"
                               value={foodName}
                               onChange={(e) => setFoodName(e.target.value)}
                    ></TextField>
                    <FormControl sx={{m: 1, width: 300}}>
                        <InputLabel id="demo-multiple-checkbox-label">Category</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectedCategories}
                            onChange={handleChange}
                            input={<OutlinedInput label="Category"/>}
                            renderValue={(selected) => selected.map(cat => cat.name).join(', ')}
                            MenuProps={MenuProps}
                        >
                            {categoryList.map((cat) => (
                                <MenuItem key={cat.id} value={cat}>
                                    <Checkbox checked={selectedCategories.indexOf(cat) > -1}/>
                                    <ListItemText primary={cat.name}/>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Stack spacing={2} direction='row'>
                        <TextField
                            id="outlined-number"
                            label="Image"
                            type="file"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => {
                                setFoodImage(e.target.files[0]);
                                setFoodImageUpdated(true)
                            }}
                        />
                        {foodImage && <Image width='20%' height='20%'
                                             address={!foodImageUpdated ? foodImage : URL.createObjectURL(new Blob([foodImage], {type: "application/image"}))}
                                             title='food'/>}
                    </Stack>
                    <TextField
                        id="outlined-number"
                        label="Price"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={foodPrice}
                        onChange={(e) => setFoodPrice(Number(e.target.value))}
                    />

                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={7}
                        placeholder="Description"
                        value={foodDescription}
                        onChange={(e) => setFoodDescription(e.target.value)}
                    />


                    <Switch
                        slots={{
                            root: Root,
                        }}
                        {...label}
                        defaultChecked
                        value={foodAvailable}
                        onChange={() => setFoodAvailable(!foodAvailable)}
                    />

                    <Button variant="contained" color="success"
                            onClick={mode === 'edit' ? editFoodHandler : addFoodHandler}>{mode === 'edit' ? "Edit" : "Add"}</Button>
                </Stack>
            </FormControl>
        </Container>
    )
}

const Root = styled('span')(
    ({theme}) => `
  font-size: 0;
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
  margin: 10px;
  cursor: pointer;

  &.${switchClasses.disabled} {
    opacity: 0.4;
    cursor: not-allowed;
  }

  & .${switchClasses.track} {
    background: ${theme.palette.mode === 'dark' ? grey[600] : grey[400]};
    border-radius: 16px;
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
  }

  & .${switchClasses.thumb} {
    display: block;
    width: 16px;
    height: 16px;
    top: 4px;
    left: 4px;
    border-radius: 16px;
    background-color: #fff;
    position: relative;
    
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  }

  &.${switchClasses.focusVisible} .${switchClasses.thumb} {
    background-color: ${grey[500]};
    box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
  }

  &.${switchClasses.checked} {
    .${switchClasses.thumb} {
      left: 20px;
      top: 4px;
      background-color: #fff;
    }

    .${switchClasses.track} {
      background: ${blue[500]};
    }
  }

  & .${switchClasses.input} {
    cursor: inherit;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 1;
    margin: 0;
  }
  `,
);

export default FoodAdd;
