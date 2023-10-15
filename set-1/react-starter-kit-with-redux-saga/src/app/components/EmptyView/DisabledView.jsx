import React from 'react'
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles(() => ({
    cardContainer: {
        display: 'grid',
        placeItems: 'center',
        marginTop: "10%",
        height: "100vh",
        gridTemplateRows: "0fr 0fr 0fr"
    },
    link: {
        textDecoration: 'underline',
        color: '#51BFB6',
    },
    screenContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        border: "1px solid lightgray",
        borderRadius: "3px",
        paddingBottom: "1rem",
        paddingTop: "1.5rem"
    },
    screenTitle: {
        color: "#00000061",
        fontSize: "1rem"
    }
}));


function DisabledView({ imgSrc, title }) {

    const classes = useStyles();

    return (
        <div className={`${classes.screenContainer} ml-10`}>
            <img src={imgSrc} alt="logo" />
            <p className={classes.screenTitle}>{title}</p>
        </div>
    )
}

export default DisabledView
