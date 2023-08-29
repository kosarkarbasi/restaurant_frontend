import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel, MenuItem, Select, Stack, Switch,
    TextField
} from "@mui/material";
import axios from "axios";

const AddressForm = ({open, onClose, phoneNumber}) => {
    const [cities, setCities] = useState([])
    const [regions, setRegions] = useState([])
    const [selectedCity, setSelectedCity] = useState('')
    const [selectionRegion, setSelectedRegion] = useState('')
    const [fullAddress, setFullAddress] = useState('')
    const [activeAddress, setActiveAddress] = useState(false)

    const label = {inputProps: {'aria-label': 'Switch demo'}};

    useEffect(() => {
        axios.get('/city/all/')
            .then(response => response.data)
            .then(allCities => setCities(allCities))
            .catch(e => console.log(e))

        axios.get('/region/all/')
            .then(response => response.data)
            .then(allRegions => setRegions(allRegions))
            .catch(e => console.log(e))
    }, [])

    useEffect(() => {
        setSelectedRegion('')
        setSelectedCity('')
    }, [open])

    const addAddressToUser = () => {
        console.log(selectedCity, selectionRegion, fullAddress, activeAddress, phoneNumber)
        axios.post(
            '/address/create/',
            {
                city: selectedCity,
                region: selectionRegion,
                full_address: fullAddress,
                active: activeAddress,
                user: phoneNumber
            }
        )
            .then(response => response.data)
            .then(onClose)
            .catch(e => console.log(e))
    }

    return (
        <div>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Enter Your Address</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} width='500px'>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">City</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedCity}
                                label="City"
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                {cities.map((city, index) => (
                                    <MenuItem key={index} value={city.name}>{city.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Region</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectionRegion}
                                label="Region"
                                onChange={(e) => setSelectedRegion(e.target.value)}
                            >
                                {regions.map((region, index) => (
                                    <MenuItem key={index} value={region.name}>{region.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div>
                            <TextField
                                autoFocus
                                id="standard-multiline-flexible"
                                label="Full Address"
                                multiline
                                fullWidth
                                maxRows={10}
                                variant="standard"
                                onChange={(e) => setFullAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Active</label>
                            <Switch {...label} value={activeAddress} defaultChecked onChange={(e) => setActiveAddress(e.target.value)}/>
                        </div>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color='error'>Cancel</Button>
                    <Button onClick={addAddressToUser} color='success'>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddressForm;