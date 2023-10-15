import React from 'react'
import { V5GlobalLayouts } from './index'
import { V5GlobalSuspense } from 'app/components'
import useSettings from 'app/hooks/useSettings'

const V5GlobalLayout = (props) => {
    const { settings } = useSettings()
    const Layout = V5GlobalLayouts[settings.activeLayout]

    return (
        <V5GlobalSuspense>
            <Layout {...props} />
        </V5GlobalSuspense>
    )
}

export default V5GlobalLayout
