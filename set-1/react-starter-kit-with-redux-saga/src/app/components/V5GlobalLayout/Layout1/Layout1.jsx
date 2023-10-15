import Footer from '../../Footer/Footer'
import Layout1Topbar from './Layout1Topbar'
import { V5GlobalSuspense } from 'app/components'
import Layout1Sidenav from './Layout1Sidenav'
import Scrollbar from 'react-perfect-scrollbar'
import useSettings from 'app/hooks/useSettings'
import { styled, Box, useTheme } from '@mui/system'
import React, { useEffect, useRef } from 'react'
import { ThemeProvider, useMediaQuery } from '@mui/material'
import { makeStyles, withStyles } from '@mui/styles';
import SidenavTheme from '../../V5GlobalTheme/SidenavTheme/SidenavTheme'
import SecondarySidebar from '../../SecondarySidebar/SecondarySidebar'
import { sidenavCompactWidth, sideNavWidth } from 'app/utilities/constant'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { Grid, Container, Divider } from '@mui/material';
import useAuth from 'app/hooks/useAuth';
import { config } from 'config.js';

const { isProd } = config;
//..ONBOARDING ENDPOINT
const ONBOARDING_API_ENDPOINT = isProd
    ? config.production.api_endpoint
    : config.development.api_endpoint;
const ONBOARDING_APIVERSION = "api/v1";
const backgroundImage = localStorage.getItem("backgroundImage");
const backgroundImageOpacity = localStorage.getItem("backgroundImageOpacity");
const Layout1Root = styled(Box)(({ theme }) => ({
    display: 'flex',
    background: theme.palette.background.default,
}));
const isMobile = localStorage.getItem("isMobile");

const ContentBox = styled(Box)(() => ({
    height: '100%',
    display: 'flex',
    overflowY: 'auto',
    overflowX: 'hidden',
    flexDirection: 'column',
    justifyContent: 'space-between',
}))

const StyledScrollBar = styled(Scrollbar)(() => ({
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexGrow: '1',
    flexDirection: 'column',
}))

const LayoutContainer = styled(Box)(({ width, secondarySidebar }) => ({
    height: '100vh',
    display: 'flex',
    flexGrow: '1',
    flexDirection: 'column',
    verticalAlign: 'top',
    marginLeft: 0,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    marginRight: secondarySidebar.open ? 50 : 0,
    backgroundColor: '#F6F8FA'
}))

const useStyles = makeStyles(() => ({
    backgroundContainer: {
        position: "relative",
        height: "auto",
        width: "100%",
        //backgroundImage: `url(${ONBOARDING_API_ENDPOINT}${ONBOARDING_APIVERSION}/files/${backgroundImage})`,
        backgroundSize: "cover",
        maxWidth: `${isMobile === 'false' && "27.33%"}`
        // margin: '12px 10px 10px',
    },
    overLay: {
        width: '100%',
        height: "100%",
        backgroundColor: `rgba(0,0,0,${1 - backgroundImageOpacity})`,
        position: "absolute",
        top: 0,
        bottom: 0
    },
    outletContainer: {
        position: "relative",
        zIndex: 1,
    },


}));
const Layout1 = () => {
    const { settings, updateSettings } = useSettings()
    const { layout1Settings, secondarySidebar } = settings
    const topbarTheme = settings.themes[layout1Settings.topbar.theme]
    const {
        leftSidebar: { mode: sidenavMode, show: showSidenav },
    } = layout1Settings
    const dispatch = useDispatch();
    const { user } = useAuth();
    const classes = useStyles();
    const isMobile = localStorage.getItem("isMobile")

    useEffect(() => {
        dispatch({
            type: 'getAllModulesAction',
            payload: {clientId: user.clientSystemId}
        })
        dispatch({
            type: 'getClientLogoAction',
            payload: {clientId: user.clientSystemId}
        })
    }, []);

    useEffect(() => {
        dispatch({
            type: 'getAllModulesAction',
            payload: {clientId: user.clientSystemId}
        })
        dispatch({
            type: 'getClientLogoAction',
            payload: {clientId: user.clientSystemId}
        })
    }, [user]);

    const getSidenavWidth = () => {
        switch (sidenavMode) {
            case 'full':
                return sideNavWidth
            case 'compact':
                return sidenavCompactWidth
            default:
                return '0px'
        }
    }

    const sidenavWidth = getSidenavWidth()
    const theme = useTheme()
    const isMdScreen = useMediaQuery(theme.breakpoints.down('md'))

    const ref = useRef({ isMdScreen, settings })
    const layoutClasses = `theme-${theme.palette.type}`

    useEffect(() => {
        let { settings } = ref.current
        let sidebarMode = settings.layout1Settings.leftSidebar.mode;
        let sidebarMenuColor = settings.layout1Settings.leftSidebar.menuColor;
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? 'close' : sidebarMode;
            let menuColor = user ? user.menuColor: sidebarMenuColor;
            updateSettings({ layout1Settings: { leftSidebar: { mode, menuColor } } })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen])

    useEffect(()=>{
        let newSideMenuColor = user && user.menuColor? user.menuColor: layout1Settings.leftSidebar.menuColor;
        let newPrimaryColor = user && user.primaryColor ? user.primaryColor: layout1Settings.main.primaryColor;
        let newFontFamily = user && user.fontFamily ? user.fontFamily : layout1Settings.themes?.typography.fontFamily;
        
        updateSettings({ layout1Settings: { leftSidebar: { menuColor: newSideMenuColor }, main: { primaryColor: newPrimaryColor } }, themes: { typography: { fontFamily: newFontFamily }} });
    }, [user])

    return (
        <Layout1Root className={layoutClasses}>
            {showSidenav && sidenavMode !== 'close' && (
                <SidenavTheme>
                    <Layout1Sidenav />
                </SidenavTheme>
            )}

            <LayoutContainer
                width={sidenavWidth}
                secondarySidebar={secondarySidebar}
            >
                {layout1Settings.topbar.show && layout1Settings.topbar.fixed && (
                    // <Layout1Topbar fixed={true} />
                    <ThemeProvider theme={topbarTheme}>
                        <Layout1Topbar fixed={true} className="elevation-z8" />
                    </ThemeProvider>
                )}
                {settings.perfectScrollbar && (
                    <StyledScrollBar>
                        {layout1Settings.topbar.show &&
                            !layout1Settings.topbar.fixed && (
                                // <Layout1Topbar />
                                <ThemeProvider theme={topbarTheme}>
                                    <Layout1Topbar />
                                </ThemeProvider>
                            )}
                        <Box flexGrow={1} position="relative">
                            <V5GlobalSuspense>
                                {/* {renderRoutes(routes)} */}
                                <Grid container direction="row">
                                    <Grid item sm={4} sx={{ display: { xs: 'none', sm: 'block' }}}>
                                    </Grid>
                                    <Divider orientation="vertical" flexItem></Divider>
                                    <Grid item xs={12} sm={4} sx={{ padding: '12px 10px 10px', height: 'calc(100vh - 64px)' }}>
                                        <Outlet />
                                    </Grid>
                                    <Divider orientation="vertical" flexItem></Divider>
                                </Grid>
                            </V5GlobalSuspense>
                        </Box>
                        {/* {settings.footer.show && !settings.footer.fixed && (
                            <Footer />
                        )} */}
                    </StyledScrollBar>
                )}

                {!settings.perfectScrollbar && (
                    <ContentBox>
                        {layout1Settings.topbar.show &&
                            !layout1Settings.topbar.fixed && (
                                // <Layout1Topbar />
                                <ThemeProvider theme={topbarTheme}>
                                    <Layout1Topbar />
                                </ThemeProvider>
                            )}
                        <Box flexGrow={1} position="relative">
                            <V5GlobalSuspense>
                                {/* {renderRoutes(routes)} */}
                                <Grid container direction="row">
                                    <Grid item sm={4} sx={{ display: { xs: 'none', sm: 'block' } }} >
                                    </Grid>
                                    <Divider orientation="vertical" flexItem></Divider>
                                    <Grid item xs={12} sm={4} className={classes.backgroundContainer} >
                                        <div className={classes.outletContainer}>
                                        <Outlet />
                                        </div>
                                        <div className={classes.overLay}></div>
                                    </Grid>
                                    <Divider orientation="vertical" flexItem></Divider>
                                </Grid>
                                
                            </V5GlobalSuspense>
                        </Box>
                        {/* {settings.footer.show && !settings.footer.fixed && (
                            <Footer />
                        )} */}
                    </ContentBox>
                )}

                {/* {settings.footer.show && settings.footer.fixed && <Footer />} */}
            </LayoutContainer>
            {/* {settings.secondarySidebar.show && <SecondarySidebar />} */}
        </Layout1Root>
    )
}

export default React.memo(Layout1)
