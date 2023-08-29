import React, {useContext} from "react";
import {Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Image from "../components/image/Image";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {CardItemContext} from "../contexts/CardItemsContext";

const CardItemsTable = () => {
    const {
        cardItems,
        addToCardItems,
        reduceFromCardItems,
        deleteFromCardItems
    } = useContext(CardItemContext)


    return (
        <TableContainer component={Paper} sx={{maxWidth: '800px', margin: 'auto', height: '100%'}}>
            <Table size="medium" aria-label="a dense table">
                <TableHead>
                    <TableRow sx={{backgroundColor: '#e3e3e3'}}>
                        <TableCell sx={{fontWeight: 'bold'}} align='center'></TableCell>
                        <TableCell sx={{fontWeight: 'bold'}} align='center'>Item</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}} align="center">Price</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}} align="center">Count</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}} align="center">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cardItems.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell align="center">
                                <Image address={row.image}
                                       height='20px'
                                       width='20px'/>
                            </TableCell>
                            <TableCell align='center' component="th" scope="row" dir='ltr'>{row.name}</TableCell>
                            <TableCell align="center">{row.price.toLocaleString()}</TableCell>
                            <TableCell align="center">
                                <Stack spacing={1} direction='row' justifyContent='center'>
                                    <Chip label={row.cardCount}/>
                                    <AddCircleOutlineIcon cursor='pointer' onClick={() => addToCardItems(row)}/>
                                    {row.cardCount > 1 &&
                                        <RemoveCircleOutlineIcon cursor='pointer'
                                                                 onClick={() => reduceFromCardItems(row)}/>}
                                    {row.cardCount === 1 &&
                                        <DeleteOutlineIcon cursor='pointer'
                                                           onClick={() => deleteFromCardItems(row)}/>}

                                </Stack>
                            </TableCell>
                            <TableCell align="center">{(row.price * row.cardCount).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={2}>Subtotal</TableCell>
                        <TableCell align="right">{cardItems.map(food => food.price * food.cardCount).reduce((a, b) => a + b, 0).toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Tax</TableCell>
                        <TableCell align="right">{`9 %`}</TableCell>
                        <TableCell align="right">{(cardItems.map(food => food.price * food.cardCount).reduce((a, b) => a + b, 0) * 0.09).toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell align="right">{(cardItems.map(food => food.price * food.cardCount).reduce((a, b) => a + b, 0) +
                            cardItems.map(food => food.price * food.cardCount).reduce((a, b) => a + b, 0) * 0.09).toLocaleString()}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
};

export default CardItemsTable;