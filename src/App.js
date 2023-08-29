import './App.css';
import SignIn from "./pages/signIn";
import {Route, Routes, useNavigate} from "react-router-dom";
import FoodList from "./pages/FoodList";
import FoodAdd from "./pages/FoodAdd";
import CardItems from "./pages/cardItems";
import FoodEdit from "./pages/FoodEdit";
import React, {useContext, useEffect} from "react";
import {
    AppBar,
    Avatar,
    Badge,
    Box, Button,
    Container,
    Fab,
    IconButton,
    Menu,
    MenuItem,
    styled,
    Toolbar, Tooltip,
    Typography
} from "@mui/material";
import AvatarImage from './assets/images/avatar.png'
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
import {AuthContext} from "./contexts/AuthContext";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {CardItemContext} from "./contexts/CardItemsContext";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import PaymentGateway from "./pages/PaymentGateway";

function App() {
    const {userInfo, logout} = useContext(AuthContext);
    const {cardItems} = useContext(CardItemContext);
    const isAuthenticated = JSON.parse(localStorage.getItem('user')) ? true : false;
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate()

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const StyledFab = styled(Fab)({
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    });

    const StyledBadge = styled(Badge)(({theme}) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }));

    return (
        <React.Fragment>
            {isAuthenticated &&
                <AppBar position="static">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <RestaurantMenuIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="/"
                                sx={{
                                    mr: 2,
                                    display: {xs: 'none', md: 'flex'},
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                KOSAR
                            </Typography>

                            <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon/>
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: {xs: 'block', md: 'none'},
                                    }}
                                >
                                    {['Foods', 'Add Food', 'Edit Food', 'Availability'].map((page) => (
                                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">{page}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                            <RestaurantMenuIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href=""
                                sx={{
                                    mr: 2,
                                    display: {xs: 'flex', md: 'none'},
                                    flexGrow: 1,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                KOSAR
                            </Typography>
                            <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                                <Button
                                    key='Foods'
                                    onClick={() => navigate('/food/all/')}
                                    sx={{my: 2, color: 'white', display: 'block'}}
                                >
                                    Foods
                                </Button>
                                <Button
                                    key='Add Food'
                                    onClick={() => navigate('/food/add/')}
                                    sx={{my: 2, color: 'white', display: 'block'}}
                                >
                                    Add Food
                                </Button>
                                <Button
                                    key='Availability'
                                    onClick={() => navigate('/food/all/')}
                                    sx={{my: 2, color: 'white', display: 'block'}}
                                >
                                    Availability
                                </Button>
                            </Box>

                            <Box sx={{flexGrow: 0}}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                        <StyledBadge
                                            overlap="circular"
                                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                            variant="dot"
                                        >
                                            <Avatar alt={userInfo.phone_number} src={AvatarImage}/>
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{mt: '45px'}}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem key='Logout' onClick={logout}>
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            }

            <Routes>
                <Route path='/login/' element={<SignIn/>}></Route>
                <Route path='/category/add/' element={<SignIn/>}></Route>
                <Route path='/food/add/' element={<FoodAdd/>}></Route>
                <Route path='/food/all/' element={<FoodList/>}></Route>
                <Route path='/food/edit/' element={<FoodEdit/>}></Route>
                <Route path='/card/' element={<CardItems/>}></Route>
                <Route path='/checkout/' element={<Checkout/>}></Route>
                <Route path='/pay/' element={<PaymentGateway/>}></Route>
                <Route path='/order/detail/' element={<OrderDetail/>}></Route>
            </Routes>

            <AppBar position="fixed" color="primary" sx={{top: 'auto', bottom: 0}}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer">
                        <MenuIcon/>
                    </IconButton>
                    <StyledFab color="secondary" aria-label="add" onClick={() => navigate('/card/')}>
                        <Badge badgeContent={cardItems.map(food => food.cardCount).reduce((a, b) => a + b, 0)}
                               color="primary">
                            <ShoppingCartIcon/>
                        </Badge>
                    </StyledFab>
                    <Box sx={{flexGrow: 1}}/>
                    <IconButton color="inherit">
                        <SearchIcon/>
                    </IconButton>
                    <IconButton color="inherit">
                        <MoreIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default App;
