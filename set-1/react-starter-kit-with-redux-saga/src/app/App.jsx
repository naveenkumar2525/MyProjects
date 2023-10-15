import '../fake-db'
import React from 'react'
import { Store } from './redux/store'
import { Provider } from 'react-redux'
import { AllPages } from './routes/routes'
import { V5GlobalTheme, GlobalCss } from 'app/components'
import { useRoutes } from 'react-router-dom'
import { AuthProvider } from 'app/contexts/JWTAuthContext'
import { SettingsProvider } from 'app/contexts/SettingsContext'
import { SnackbarProvider } from 'notistack';
import { SuccessSnackbar } from './components/V5GlobalSnackbar/V5GlobalSnackbar';
import { ErrorSnackbar } from './components/V5GlobalSnackbar/V5GlobalSnackbar';

const App = () => {
    const all_pages = useRoutes(AllPages())

    return (
        <Provider store={Store}>
            <SuccessSnackbar />
            <ErrorSnackbar />
            <SnackbarProvider>
            <SettingsProvider>
                <V5GlobalTheme>
                    <GlobalCss />
                    <AuthProvider>{all_pages}</AuthProvider>
                </V5GlobalTheme>
            </SettingsProvider>
            </SnackbarProvider>
        </Provider>
    )
}

export default App
