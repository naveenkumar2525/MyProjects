import React, { useEffect } from 'react'
import Brand from '../../Brand/Brand'
import { convertHexToRGB } from 'utils'
import { Box, styled, useTheme } from '@mui/system'
import Sidenav from '../../Sidenav/Sidenav'
import useSettings from 'app/hooks/useSettings'
import { Hidden, Icon, IconButton } from '@mui/material'
import { themeShadows } from 'app/components/V5GlobalTheme/themeColors'
import { sidenavCompactWidth, sideNavWidth } from 'app/utilities/constant'

const SidebarNavRoot = styled(Box)(({ theme, width, primaryBg, bgImgURL }) => ({
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: width,
    boxShadow: themeShadows[8],
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top',
    backgroundSize: 'cover',
    zIndex: 111,
    overflow: 'hidden',
    color: theme.palette.text.primary,
    transition: 'all 250ms ease-in-out',
    background: `rgba(${primaryBg})`,
    // backgroundImage: `linear-gradient(to bottom, rgba(${primaryBg}, 0.96), rgba(${primaryBg}, 0.96)), url(${bgImgURL})`,
    // '&:hover': {
    //     width: sideNavWidth,
    //     '& .sidenavHoverShow': {
    //         display: 'block',
    //     },
    //     '& .compactNavItem': {
    //         width: '100%',
    //         maxWidth: '100%',
    //         '& .nav-bullet': {
    //             display: 'block',
    //         },
    //         '& .nav-bullet-text': {
    //             display: 'none',
    //         },
    //     },
    // },
}))

const NavListBox = styled(Box)(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}))

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.primary,
}))

const Layout1Sidenav = () => {
    const theme = useTheme()
    const { settings, updateSettings } = useSettings()
    const leftSidebar = settings.layout1Settings.leftSidebar
    const { mode, bgImgURL } = leftSidebar

    const getSidenavWidth = () => {
        switch (mode) {
            case 'compact':
                return sidenavCompactWidth
            default:
                return sideNavWidth
        }
    }

    // const primaryRGB = convertHexToRGB(theme.palette.primary.main)
    const primaryRGB = convertHexToRGB(leftSidebar.menuColor);

    const updateSidebarMode = (sidebarSettings) => {
        updateSettings({
            layout1Settings: {
                leftSidebar: {
                    ...sidebarSettings,
                },
            },
        })
    }

    const handleSidenavToggle = () => {
        updateSidebarMode({ mode: mode === 'compact' ? 'full' : 'compact' })
    }

    const handleSidebarToggle = () => {
        let { layout1Settings } = settings;
        let mode = layout1Settings.leftSidebar.mode === 'close'
                    ? 'mobile'
                    : 'close';
        updateSidebarMode({ mode });
    }

    return (
        <SidebarNavRoot
            bgImgURL={bgImgURL}
            primaryBg={primaryRGB}
            width={getSidenavWidth()}
        >
            <NavListBox>
                <Brand>
                    <Hidden smDown>
                        {/* <Switch
                            onChange={handleSidenavToggle}
                            checked={leftSidebar.mode !== 'full'}
                            color="secondary"
                            size="small"
                        /> */}
                        <StyledIconButton onClick={handleSidenavToggle}>
                            <Icon className={"material-icons-two-tone text-white"}>{mode === 'full' ? 'close' : 'menu'}</Icon>
                        </StyledIconButton>
                    </Hidden>
                    {
                        mode === 'mobile' ?
                        <StyledIconButton onClick={handleSidebarToggle}>
                                <Icon className={"material-icons-two-tone text-white"}>{(mode === 'mobile') ? 'close' : 'menu'}</Icon>
                        </StyledIconButton>
                        : null
                    }
                </Brand>
                <Sidenav />
            </NavListBox>
        </SidebarNavRoot>
    )
}

export default React.memo(Layout1Sidenav)
