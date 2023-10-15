import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuth from 'app/hooks/useAuth'
import useSettings from 'app/hooks/useSettings'
import { styled, useTheme, Box } from '@mui/system'
import { Span } from '../../../components/Typography'
import { V5GlobalMenu } from 'app/components'
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles'
import {
    Icon, IconButton, MenuItem, Avatar, useMediaQuery, Grid,
} from '@mui/material'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { topBarHeight } from 'app/utilities/constant'

import ConfirmPassword from './ChangePassword';
import ConfirmationDialog from 'app/components/ConfirmationDialog/ConfirmationDialog';
import { V5GlobalLogo } from 'app/components';
import { config } from 'config';


const { isProd } = config;
//..SCREENBUILDER ENDPOINT 
const API_ENDPOINT = isProd
    ? config.production.api_endpoint
    : config.development.screenbuilder_api_endpoint;

const APIVERSION = "screenbuilder/api/v1";
const token = localStorage.getItem('accessToken');
//..ONBOARDING ENDPOINT
const ONBOARDING_API_ENDPOINT = isProd
    ? config.production.api_endpoint
    : config.development.api_endpoint;
const ONBOARDING_APIVERSION = "api/v1";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.primary,
}))

const style = {
    position: 'relative',
    right: 5
};


const TopbarRoot = styled('div')(({ theme }) => ({
    top: 0,
    // zIndex: 96,
    transition: 'all 0.3s ease',
    // boxShadow: themeShadows[8],
    height: topBarHeight,
}))

const TopbarContainer = styled(Box)(({ theme }) => ({
    padding: '8px',
    paddingLeft: 18,
    paddingRight: 20,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // background: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
        paddingLeft: 0,
        paddingRight: 16,
    },
    [theme.breakpoints.down('xs')]: {
        paddingLeft: 0,
        paddingRight: 16,
    },
}))

const UserMenu = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: 24,
    padding: 4,
    '& span': {
        margin: '0 8px',
    },
}))

const StyledItem = styled(MenuItem)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    minWidth: 185,
    '& a': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
    },
    '& span': {
        marginRight: '10px',
        color: theme.palette.text.primary,
    },
}))

const IconBox = styled('div')(({ theme }) => ({
    display: 'inherit',
    [theme.breakpoints.down('md')]: {
        display: 'none !important',
    },
}))

const Layout1Topbar = () => {
    const theme = useTheme()
    const { settings, updateSettings } = useSettings()
    const { logout, user } = useAuth()
    const isMdScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [ showLogoutPopup, setShowLogoutPopup] = React.useState(false);
    const { userProfileLogo, profileId, userProfileDetails } = useSelector((state) => state.profile);
    const [profileLogoHeader, setProfileLogoHeader] = React.useState('');
    const dispatch = useDispatch();
    const { isProd } = config;
    //..ONBOARDING ENDPOINT
    const ONBOARDING_API_ENDPOINT = isProd
        ? config.production.api_endpoint
        : config.development.api_endpoint;
    const ONBOARDING_APIVERSION = "api/v1";
    const backgroundImage = localStorage.getItem("backgroundImage");
    const backgroundImageOpacity = localStorage.getItem("backgroundImageOpacity");
    const primaryColor = settings.layout1Settings.main.primaryColor
    const location = useLocation();
    const updateSidebarMode = (sidebarSettings) => {
        updateSettings({
            layout1Settings: {
                leftSidebar: {
                    ...sidebarSettings,
                },
            },
        })
    }
    useEffect(()=>{
        dispatch({
            type: "getUserProfileDetailsAction" 
        });
        dispatch({
            type: "getStatesCitiesMasterAction" 
        });
        // dispatch({
        //     type: "getUserProfileLogoAction" 
        // });
        dispatch({
            type: "getStatesDataAction" 
        });
    },[])

    useEffect(() => {
        localStorage.setItem("isMobile", isMdScreen)
    }, [isMdScreen]);

    useEffect(() => {
        let header = "";
        if (localStorage.getItem('typeOfUser') === "Admin") {
            header = userProfileDetails.fullName ? userProfileDetails.fullName.substring(0, 2) : ""
        } else {
            header = userProfileDetails.firstName ? userProfileDetails.firstName.substring(0, 2) : "";
        }
        setProfileLogoHeader(header);
    }, [userProfileDetails])

    const handleSidebarToggle = () => {
        let { layout1Settings } = settings
        let mode
        if (isMdScreen) {
            mode =
                layout1Settings.leftSidebar.mode === 'close'
                    ? 'mobile'
                    : 'close'
        } else {
            mode =
                layout1Settings.leftSidebar.mode === 'full' ? 'close' : 'full'
        }
        updateSidebarMode({ mode })
    }
    const [passwordViewOpen, setPasswordViewOpen] = React.useState(false);
    const handlePasswordViewToggle = () => setPasswordViewOpen(true);
    const handlePasswordViewClose = () => setPasswordViewOpen(false);

    const confirmLogout = () => {
        setShowLogoutPopup(true);
    }
    const useStyles = makeStyles(() => ({
        TopbarContainer: {
            position: "relative",
            backgroundImage: `${isMdScreen && `url(${ONBOARDING_API_ENDPOINT}${ONBOARDING_APIVERSION}/files/${backgroundImage})`}`,
        },
        overLay: {
            width: '100%',
            height: "100%",
            backgroundColor: `${isMdScreen && `rgba(0,0,0,${1 - backgroundImageOpacity})`}`,
            position: "absolute",
            top: 0,
            bottom: 0
        },
        burgerIcon: {
            position: "absolute",
            right: 5
        },
        img: {
            width: '3rem',
            height: '3rem',
            top: "18%",
            borderRadius: '50%',
            position: 'absolute',
            transition: '.2s ease',
        },
        imgMobile: {
            width: '2.5rem',
            height: '2.5rem',
            top: "18%",
            borderRadius: '50%',
            position: 'absolute',
            transition: '.2s ease',
        },


    }));

    const classes = useStyles();

    return (
        
        <>
            <ConfirmPassword open={passwordViewOpen} handleClose={handlePasswordViewClose} />
            <TopbarRoot>
                <TopbarContainer className={classes.TopbarContainer}>
                    <div className={classes.overLay}></div>
                    <Box display="flex" alignItems="center">
                        <V5GlobalMenu
                            menuButton={
                                <UserMenu>
                                    {isMdScreen ? userProfileDetails?.profileId ? <Avatar
                                        src={`${ONBOARDING_API_ENDPOINT}${ONBOARDING_APIVERSION}/files/${userProfileDetails?.profileId}`}
                                        sx={{ cursor: 'pointer' }}
                                    /> : profileId && location.pathname === '/dashboard' ?
                                        <Avatar
                                            src={`${ONBOARDING_API_ENDPOINT}${ONBOARDING_APIVERSION}/files/${profileId}`}
                                            sx={{ cursor: 'pointer' }}
                                        />
                                        : location.pathname === '/dashboard' ?
                                            <Grid className={classes.imgMobile} style={{ backgroundColor: primaryColor }}>
                                                <h4 style={{ textAlign: 'center', marginTop: '0.5rem', textTransform: 'uppercase' }}>{profileLogoHeader}</h4>
                                            </Grid> : null : userProfileDetails?.profileId ?
                                        <Avatar
                                            src={`${ONBOARDING_API_ENDPOINT}${ONBOARDING_APIVERSION}/files/${userProfileDetails?.profileId}`}
                                            sx={{ cursor: 'pointer' }}
                                        /> : profileId ?
                                        <Avatar
                                         src={`${ONBOARDING_API_ENDPOINT}${ONBOARDING_APIVERSION}/files/${profileId}`}
                                            sx={{ cursor: 'pointer' }}
                                        />
                                        :
                                        <Grid className={classes.img} style={{ backgroundColor: primaryColor }}>
                                            <h3 style={{ textAlign: 'center', marginTop: '0.7rem', textTransform: 'uppercase' }}>{profileLogoHeader}</h3>
                                        </Grid>}

                                </UserMenu>
                            }>
                            <StyledItem>
                                <Link to="/user-profile">
                                    <Icon> person </Icon>
                                    <Span>My Profile </Span>
                                </Link>
                            </StyledItem>
                            <StyledItem onClick={handlePasswordViewToggle}>
                                <Icon> <ChangeCircleIcon /> </Icon>
                                <Span> Change Password </Span>
                            </StyledItem>
                            <StyledItem onClick={confirmLogout}>
                                <Icon> power_settings_new </Icon>
                                <Span> Logout </Span>
                            </StyledItem>
                        </V5GlobalMenu>
                    </Box>
                    <Box className="flex justify-center w-full" >
                        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <StyledIconButton onClick={handleSidebarToggle} className={classes.burgerIcon}>
                                <Icon style={{ color: primaryColor, transform: "rotateY(180deg)" }}>notes</Icon>
                            </StyledIconButton>
                        </Box>
                        <Box className="z-index-1">
                            <V5GlobalLogo />
                        </Box>
                    </Box>
                    <ConfirmationDialog
                        open={showLogoutPopup}
                        onConfirmDialogClose={() => setShowLogoutPopup(false)}
                        text={`Are you sure you want to logout ?`}
                        onYesClick={logout}
                    />
                </TopbarContainer>
            </TopbarRoot>
        </>
    )
}

export default React.memo(Layout1Topbar)