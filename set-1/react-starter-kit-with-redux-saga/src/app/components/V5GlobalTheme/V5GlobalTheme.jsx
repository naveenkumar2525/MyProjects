import React, { useState, useEffect } from 'react'
import useSettings from 'app/hooks/useSettings'
import { CssBaseline, ThemeProvider } from '@mui/material'
import useAuth from 'app/hooks/useAuth';

const V5GlobalTheme = ({ children }) => {
    const { settings, updateSettings } = useSettings();
    const { user } = useAuth();
    const [ activeTheme, setActiveTheme ] = useState({...settings.themes});

    useEffect(()=>{
        setActiveTheme({...settings.themes});
    }, [settings.themes])
    
    // let activeTheme = { ...settings.themes[settings.activeTheme] }
    // let activeTheme = { ...settings.themes }
    return (
        <ThemeProvider theme={activeTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

export default V5GlobalTheme
