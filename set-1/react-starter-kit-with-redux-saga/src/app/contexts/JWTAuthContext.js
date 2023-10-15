import React, { createContext, useEffect, useReducer } from 'react'
import jwtDecode from 'jwt-decode'
import axios from 'axios.js'
import { V5GlobalLoading } from 'app/components'
import { signInService, logOutService, changePasswordService } from './../redux/AuthManagement/AuthManagementService';
import { setProfileID } from 'app/redux/UserProfileManagement/userProfileManagementSlice';

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }

    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { },
    register: () => Promise.resolve(),
    changePassword: () => Promise.resolve()
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const login = async (userId, password) => {
        // const response = await axios.post('/api/auth/login', {
        //     email,
        //     password,
        // })
        const response = await signInService({userId, password});
        dispatch({
            type: setProfileID.type,
            payload : localStorage.getItem('profileId')? localStorage.getItem('profileId') : '',
        })
        const { token } = response;
        const user = {...jwtDecode(response.token), fontFamily: response.font, menuColor: response.menuColor, primaryColor: response.primaryColor};
        setSession(token);
        localStorage.setItem("themeData", JSON.stringify({fontFamily: response.font, menuColor: response.menuColor, primaryColor: response.primaryColor}));
        localStorage.setItem("backgroundImage", response.backgroundImageId);
        localStorage.setItem("backgroundImageOpacity", response.opacity);
        localStorage.setItem('profileId', response.profileId);
        localStorage.setItem('googleMapAuthKey', response.googleMapAuthKey);
        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        })
    }

    const register = async (email, username, password) => {
        const response = await axios.post('/api/auth/register', {
            email,
            username,
            password,
        })

        const { accessToken, user } = response.data;

        setSession(accessToken);

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        })
    }

    const changePassword = async (data) => {
        const response = await changePasswordService(data);
        logout();
    }

    const logout = () => {
        logOutService();
        setSession(null);
        localStorage.removeItem("backgroundImage");
        localStorage.removeItem("backgroundImageOpacity");
        localStorage.removeItem("profileId");
        localStorage.removeItem("googleMapAuthKey");
        dispatch({ type: 'LOGOUT' });
    }

    useEffect(() => {
        ; (async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const themeData = window.localStorage.getItem('themeData');

                // if (accessToken && isValidToken(accessToken)) {
                if (accessToken) {
                    setSession(accessToken)
                    // const response = await axios.get('/api/auth/profile')
                    // const { user } = response.data
                    const user = {...jwtDecode(accessToken), ...JSON.parse(themeData)};
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <V5GlobalLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                register,
                changePassword
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
