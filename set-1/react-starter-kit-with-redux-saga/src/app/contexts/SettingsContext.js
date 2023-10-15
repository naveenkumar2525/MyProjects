import React, { createContext, useState } from 'react'

import { merge } from 'lodash'

import { V5GlobalLayoutSettings } from 'app/components/V5GlobalLayout/settings'

const SettingsContext = createContext({
    settings: V5GlobalLayoutSettings,
    updateSettings: () => {},
})

export const SettingsProvider = ({ settings, children }) => {
    const [currentSettings, setCurrentSettings] = useState(
        settings || V5GlobalLayoutSettings
    )

    const handleUpdateSettings = (update = {}) => {
        const marged = merge({}, currentSettings, update)
        setCurrentSettings(marged)
    }

    return (
        <SettingsContext.Provider
            value={{
                settings: currentSettings,
                updateSettings: handleUpdateSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsContext
