import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { Snackbar, SnackbarContent, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import { SNACKBAR_CLEAR } from 'app/redux/slices/snackbar';

const useStyles = makeStyles(({ palette, ...theme }) => ({
    // snackBar: {
    //     marginLeft: "10px"
    // }
}))

// success
const SuccessSnackbar = () => {
    const dispatch = useDispatch();
    const classes  = useStyles();
    const { successSnackbarMessage, successSnackbarOpen } = useSelector(
        (state) => state.SnackbarReducer
    );
    
    function handleClose() {
        dispatch({ type: SNACKBAR_CLEAR.type });
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={successSnackbarOpen}
            autoHideDuration={4000}
            onClose={handleClose}
            aria-describedby='client-snackbar'
            className={classes.snackBar}
                >
            <SnackbarContent
                // style={{
                //     backgroundColor: '#00AB55',
                // }}
                message={
                <span
                    id='client-snackbar'
                    style={{ verticalAlign: 'middle', display: 'inline-flex' }}
                >
                    <span>
                        <CheckCircleOutlineIcon />
                    </span>
                    <span style={{ marginLeft: 15 }}>{successSnackbarMessage}</span>
                </span>
                }
                action={[
                    <IconButton
                        key='close'
                        aria-label='close'
                        color='inherit'
                        onClick={handleClose}
                        className='pb-5'
                    >
                        <CloseIcon />
                    </IconButton>
                ]}
            />
        </Snackbar>
    );
}

//Error

const  ErrorSnackbar = () => {
    const dispatch = useDispatch();
    const classes  = useStyles();
    const { errorSnackbarMessage, errorSnackbarOpen } = useSelector(
        (state) => state.SnackbarReducer
    );
    
    function handleClose() {
        dispatch({ type: SNACKBAR_CLEAR.type });
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={errorSnackbarOpen}
            autoHideDuration={4000}
            onClose={handleClose}
            aria-describedby='client-snackbar'
            className={classes.snackBar}
            >
            <SnackbarContent
                style={{
                backgroundColor: '#D3302F'
                }}
                message={
                <span
                    id='client-snackbar'
                    style={{ verticalAlign: 'middle', display: 'inline-flex' }}
                >
                    <span>
                        <WarningIcon color="#FFFFFF"/>
                    </span>
                    <span style={{ marginLeft: 15 }}>{errorSnackbarMessage}</span>
                </span>
                }
                action={[
                    <IconButton
                        key='close'
                        aria-label='close'
                        color='inherit'
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        </Snackbar>
    );
}


export  {SuccessSnackbar, ErrorSnackbar};