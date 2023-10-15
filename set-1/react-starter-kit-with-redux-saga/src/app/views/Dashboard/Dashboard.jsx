import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Divider, Grid, Icon, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import SecurityIcon from '@mui/icons-material/Security'
import { capitalizeFirstLetter } from 'utils'
import moment from 'moment'
import UserAvatar from './components/Avatar'
import ModuleCard from './components/ModuleCard'
import Chart from './components/Chart'
import { useNavigate } from 'react-router-dom'
import useSettings from 'app/hooks/useSettings'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"

// import FilterPopup from './components/FilterCharts'

const useStyles = makeStyles(({ palette, ...theme }) => ({
    root: {
        '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            height: '100%',
        },
        paper: {
            '@media screen and (min-width: 800px)': {
                width: `calc((100% - 260px) / 3)`,
                marginLeft: `calc(((100% - 260px) / 3) + 260px)`,
            },
            '@media screen and (min-width: 799px)': {
                width: `calc((100% - 260px) / 3)`,
                marginLeft: `calc(((100% - 260px) / 3) + 260px)`,
            },
        },
    },

    text: {
        fontSize: '36px',
        lineHeight: '43px',
        letterSpacing: '1.8px',
        color: '#000000',
        //fontFamily: 'SF Pro Display',
        marginBottom: 20,
    },

    count: {
        fontSize: '22px',
        letterSpacing: '0.79px',
        lineHeight: '29px',
        // fontFamily: 'SF Pro Display',
        color: '#000000DE',
        marginBottom: 0,
    },

    securityCard: {
        background: '#F4EAE0 0% 0% no-repeat padding-box',
        borderRadius: '4px',
        opacity: 1,
        width: '100%',
        height: '9rem',
    },
    crCard1: {
        borderRadius: '4px',
        opacity: 1,
        minHeight: '13rem',
        maxHeight: '13rem',
    },

    securityIcon: {
        padding: '3px',
        '& svg': {
            fontSize: '17px',
            color: '#757575',
            marginLeft: '140px',
            opacity: 1,
        },
    },

    chartText: {
        fontSize: '14px',
        lineHeight: '16px',
        letterSpacing: '0.46',
        color: '#000000',

        marginTop: 4,
    },
    form: {
        width: '6rem',
        borderRadius: '90px',
        justifyContent: 'center',
        paddingLeft: 3,
        fontSize: '11px',
    },
    dateText: {
        fontSize: '10px',
        lineHeight: '12px',
        fontWeight: 2,
        color: '#BDBDBD',
    },
    text1: {
        fontSize: '14px',
        lineHeight: '12px',
        color: '#000000',
        // fontWeight:"20"
    },
    logTime: {
        fontSize: '14px',
        lineHeight: '12px',
        color: '#666666',
        fontFamily: 'SF Pro Display',
        marginLeft: 15,
        fontWeight: 10,
        paddingBottom: 0,
    },
    time: {
        fontSize: '10px',
        lineHeight: '11px',
        color: '#666666',
        fontFamily: 'SF Pro Display',
        marginLeft: '60px',
        paddingBottom: '3px',
    },
    subText: {
        fontSize: '10px',
        lineHeight: '11px',
        color: '#666666',
        fontFamily: 'SF Pro Display',
        marginLeft: '7px',
    },

    horizontalBorder: {
        borderTop: '1px solid #00000021',
    },

    total: {
        fontSize: '14px',
        letterSpacing: '0.46px',
        lineHeight: '16px',
        color: '#000000',
        marginBottom: 10,
        padding: 2,
    },
    paper: {
        width: '90vw',
        marginLeft: '8px',
    },
    paper2: {
        width: '27vw',

        margin: '3px',
    },
    img: {
        borderRadius: '50%',
        width: '2rem',
        height: '2rem',
    },
    imgTexts: {
        fontSize: '10px',
        color: '#B3B3B3',
    },
    modulesCard: {
        // background: ' #E6F6F3',
        borderRadius: '10px',
        position: 'relative',
        height: 'auto',
        width: 'auto',
        padding: '16px 3px 20px 5px',
        minHeight: '9rem',
        display: "flex",
        justifyContent: "space-between",
        marginLeft: "0.3rem"
    },
    Cards: {
        background: '#FFFFFF ',
        borderRadius: '16px',
        opacity: 1,
        marginLeft: 'auto',
        marginRight: 15,
        width: '120px',
        height: '125px',
        textAlign: 'center',
        marginTop: '35px',
        '& svg': {
            fontSize: '40px',
            marginTop: '-50px',
            fill: 'blue',
        },
    },

    cardShow: {
        background: '#50BFB7',
        borderRadius: '16px',
        opacity: 1,
        position: 'relative',
        paddingLeft: '12px',
        paddingTop: '10px',
        marginRight: 15,
        width: '120px',
        height: '125px',
        textAlign: 'center',
        marginTop: '43px',
    },
    subContent: {
        fontSize: '14px',
        lineHeight: '19px',
        letterSpacing: '0.53px',
        color: '#000000',
        fontWeight: 'bold',
    },
    show: {
        width: '10px',
        color: '#FFFFFF',
        fontWeight: 'normal',
    },

    horiScroll: {
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
            width: '0em',
        },
    },
    chartReverse: {
        background: '#ffffff !important ',
        transform: 'rotate(90deg)',
        borderRadius: '4px',
        '& svg': {
            marginTop: '10px',
            marginLeft: '-20px',
        },
    },

    header: {
        fontSize: '36px',
        letterSpacing: '1.2px',
        position: 'absolute',
        // background: '#F6F8FA',
        zIndex: 1,
        top: '20px',
        maxWidth: '15em',
        marginLeft: "3.1%",
        // paddingBottom: "2rem"
    },
    scrollbar: {
        overflowX: 'scroll',
        overflowY: 'scroll',
        maxHeight: '100%',
        '&::-webkit-scrollbar': {
            width: '0em',
        },
        paddingTop: '110px',
    },
    reportingCard: {
        borderRadius: '4px',
        padding: '16px 10px 10px 24px',
        height: '9rem',
    },
    reportingHeading: {
        fontSize: '14px',
        marginBottom: '2rem',
    },
    toggleCard: {
        width: '120px',
        height: '137px',
        background: '#DCDCDC',
        color: '#0000001F',
        fontSize: '16px',
        boxShadow: '0px 12px 36px #00000029',
        borderRadius: '16px',
        padding: '12px',
        fontWeight: 'bold',
        marginLeft: 'auto',
        '&.active': {
            background: '#50BFB7',
            color: '#FFFFFF',
        },
    },
    chevronRightStyle: {
        background: '#0000001F',
        color: '#DCDCDC',
        borderRadius: '100px',
        '&.active': {
            background: '#FFFFFF',
            color: '#50BFB7',
        },
    },
    chevronUpStyle: {
        background: '#FFFFFF',
        color: '#50BFB7',
        borderRadius: '100px',
        cursor: 'pointer',
    },
    MuiMenuPaper: {
        width: '200px',
    },
    welcomeHeading: {
        color: "#1D3D4A",
        fontSize: "1.5rem",
        fontWeight: "300"
    },
    name: {
        color: "#1D3D4A",
        fontSize: "1.5rem",
        fontWeight: "600",
        marginTop: "-0.5rem"
    },
    loginDetails: {
        fontSize: "0.5rem",
        marginTop: "-0.2rem"
    },
    dashboardImage: {
        borderRadius: "15px"
    },
    moduleUnderLine: {
        width: "6%",
        height: "0.2rem",
        marginLeft: "4rem",
        marginTop: "-0.4rem"
    },
    moduleHeading: {
        fontSize: "1.5rem",
        fontWeight: "400"
    },
    backgroundImageStyle: {
        width: "100%",
        height: "auto",
        position: "absolute"
    },
    moduleBelowPadding: {
        paddingBottom: "20rem"
    }
}))
function Dashboard() {
    const [showAll, setShowAll] = useState(false);
    const [name, setName] = useState("");
    const [surname, setSurName] = useState("");
    const classes = useStyles()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { login, reporting, charts, modules } = useSelector(
        (state) => state.dashboard
    )
    const {
        userProfileDetails: { firstName, lastName, fullName, profileId },
    } = useSelector((state) => state.profile);
    const { userProfileDetails, isProfileUpdated } = useSelector((state) => state.profile);
    const backgroundImage = localStorage.getItem("backgroundImage")
    const moreThanFour = modules?.length > 4 ? true : false
    const lastLoginDate = login?.time
        ? moment(login?.time).format('DD MMMM YYYY')
        : ''
    const lastLoginTime = login?.time ? moment(login?.time).format('h:mm a') : ''
    const { settings } = useSettings();
    const primaryColor = settings.layout1Settings.main.primaryColor;
    const profilImageId = localStorage.getItem("profileId");

    const toggleShowHide = () => {
        if (!moreThanFour) return false
        setShowAll(!showAll)
    }
    const ToggleShowHide = (
        <Grid item xs={6} className="mb-6">
            <div
                className={`${classes.toggleCard} ${
                    moreThanFour ? 'active' : ''
                }`}
            >
                <div>Show </div>
                <div className="mb-8">{showAll ? 'Less' : 'All'}</div>
                <Icon
                    onClick={toggleShowHide}
                    className={
                        showAll
                            ? classes.chevronUpStyle
                            : classes.chevronRightStyle
                    }
                >
                    {showAll ? 'keyboard_arrow_up' : 'chevron_right'}
                </Icon>
            </div>
        </Grid>
    )

    useEffect(() => {
        dispatch({
            type: 'getDashboardDataAction',
        })
        dispatch({
            type: 'getSitesDataAction',
        })
    }, [])
    useEffect(() => {

        if (fullName) {
            let NameArray = fullName.split(" ");
            setName(NameArray[0].charAt(0).toUpperCase()+ NameArray[0].slice(1).toLowerCase());
            setSurName(NameArray[1].charAt(0).toUpperCase());
            // setSurName(NameArray[1].charAt(0).toUpperCase()+ NameArray[1].slice(1).toLowerCase());
        } else if (firstName || lastName) {
            setName(firstName.charAt(0).toUpperCase()+firstName.slice(1).toLowerCase());
            // setSurName(lastName.charAt(0).toUpperCase()+lastName.slice(1).toLowerCase());
            setSurName(lastName.charAt(0).toUpperCase());
        }
    }, [fullName, firstName, lastName]);
    const handleCardAction = (id, name) => {
        if (name === "Charts") {
            navigate(`/module/${name}`);
        } else {
            navigate(`/module/${name}/${id}`);
        }
    }

    const checkModuleLength = () => {
        if (modules.length === 0 || modules.length < 7) {
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {
        let updatedData = { ...userProfileDetails };
        updatedData["profileId"] = profilImageId;
        updatedData["profileUrl"] = "";
        if (isProfileUpdated) {
            if (updatedData["phone"]) {
                dispatch({
                    type: "updateUserProfileDetailsAction",
                    payload: updatedData,
                    profileId
                });
            }
        }

    }, [profilImageId]);
    return (
        <div className="p-2" style={{ position: 'relative' }}>
            <Grid container className={classes.header}>
                <Grid item xs={12}>
                    <div className={classes.welcomeHeading}>Welcome Back! </div>
                    <div className={classes.name}>
                            {capitalizeFirstLetter(
                                name + " " + surname
                            )}
                    </div>
                    <div className={classes.loginDetails}>
                        Last Login:{lastLoginDate} at {lastLoginTime}
                    </div>
                </Grid>
            </Grid>
            <div className={classes.scrollbar}>
                <Grid container>
                    <Grid item xs={12} className="z-index-1">
                        <Carousel showThumbs={false} showArrows={false} autoPlay showStatus={false} infiniteLoop={true}>
                            <div >
                                <img className={classes.dashboardImage} src={"/assets/images/Banner1.jpg"} />
                            </div>
                            <div>
                                <img className={classes.dashboardImage} src={"/assets/images/Banner-2.jpg"} />
                            </div>
                            <div>
                                <img className={classes.dashboardImage} src={"/assets/images/Banner-3.jpg"} />
                            </div>
                            <div>
                                <img className={classes.dashboardImage} src={"/assets/images/Banner-4.jpg"} />
                            </div>
                            <div>
                                <img className={classes.dashboardImage} src={"/assets/images/FM-Banner.jpg"} />
                            </div>
                        </Carousel>
                    </Grid>
                </Grid>
                <Grid container className="mt-8">
                    <Grid item xs={12} className="z-index-1 ml-3">
                        <div>
                            <div >
                                <h5 className={classes.moduleHeading}>Modules</h5>
                                <div className={classes.moduleUnderLine} style={{ backgroundColor: primaryColor }}></div>
                            </div>
                        </div>
                        {/* <Paper elevation={0} className={classes.reportingCard}>
                            <div className="font-bold mb-4">Reporting To</div>
                            {reporting?.employeId ? (
                                <div className="flex items-center">
                                    <UserAvatar user={reporting} />
                                    <div className="ml-6">
                                        <div>{reporting?.name}</div>
                                        <div className={classes.imgTexts}>
                                            Emp ID: {reporting?.employeId}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                '-'
                            )}
                        </Paper> */}
                    </Grid>
                </Grid>
                <div className={`${classes.modulesCard} mt-1`}>
                    <Grid container spacing={1} className={checkModuleLength() && classes.moduleBelowPadding}>
                        {modules.map((module, i) => (
                            <Grid item className="mt-2" xs={4}>
                                <ModuleCard modulePage={"dashboard"} module={module} key={i} handleCardAction={handleCardAction} />
                            </Grid>
                        ))}
                    </Grid>
                </div>
                {/* {charts.map((chart) => (
                    <Chart chart={chart} key={chart.id}/>
                ))} */}
            </div>
        </div>
    )
}

export default Dashboard
