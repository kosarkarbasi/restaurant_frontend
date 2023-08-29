import axios from "axios";
import Cookies from "js-cookie";

const LoginAction = (phone_number, password, callback) => {
    axios.post('/users/login/', {user: {phone_number: phone_number, password: password}})
        .then(res => res.data)
        .then(response => {
            callback(
                {
                    token: response.user.token,
                    user: {
                        email: response.user.email,
                        phone_number: response.user.phone_number,
                        address: JSON.parse((response.user.address).replace(/'/g, '"')),
                    },
                    error: false,
                    errorMessage: null
                })
        })
        .catch((e) => {
            console.log(e)
            callback({user: null, error: true, errorMessage: 'password incorrect!'})
        })
}

const SignupAction = (phone_number, password, type, callback) => {
    axios.post(
        '/users/signup/',
        {user: {phone_number: phone_number, password: password, type: type}},
        {
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken')
            }
        }
    )
        .then(response => response.data)
        .then(result => {
            callback(true)
        })
        .catch(e => {
            console.log(e)
        })
}

const CheckUserExistence = (phone_number, callback) => {
    const formData = new FormData();
    formData.append("phone_number", phone_number);
    axios.post(
        '/user/exist/',
        formData,
        {
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken')
            }
        }
    )
        .then(r => r.data)
        .then(data => {
            callback(data.existence)
        })
}


export {LoginAction, SignupAction, CheckUserExistence};