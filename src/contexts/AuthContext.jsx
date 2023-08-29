import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

export const AuthContext = React.createContext()

const AuthContextProvider = (props) => {
    const [authenticated, setAuthenticated] = useState(localStorage.getItem('user') ? true : false)
    const [token, setToken] = useState('')
    const [userInfo, setUserInfo] = useState('')
    const navigate = useNavigate()

    const login = (token, user) => {
        console.log('user ---->  ', user)
        setAuthenticated(true)
        setToken(token)
        setUserInfo(user)
        localStorage.setItem('user', JSON.stringify({
            isAuthenticated: true,
            userInfo: {
                email: user.email,
                phoneNumber: `${user.phone_number}`,
                address: user.address
            },
            token: token
        }))
    }

    const logout = () => {
        setAuthenticated(false)
        localStorage.removeItem('user')
        navigate('/food/all/', {replace: true})
    }

    return (
        <AuthContext.Provider value={{authenticated, token, userInfo, login, logout,}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;