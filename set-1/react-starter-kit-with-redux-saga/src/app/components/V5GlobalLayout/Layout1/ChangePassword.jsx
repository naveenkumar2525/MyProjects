import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { makeStyles } from '@mui/styles'
import { FormControl, IconButton, Grid, OutlinedInput, InputLabel, InputAdornment, Button } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import useAuth from 'app/hooks/useAuth'
import { SNACKBAR_SUCCESS, SNACKBAR_ERROR } from 'app/redux/slices/snackbar';
import { styled } from '@mui/system'

const useStyles = makeStyles(() => ({
  drawerStyle: {
    '& .MuiDrawer-paperAnchorBottom': {
      borderTopRightRadius: "16px",
      borderTopLeftRadius: "16px",
      background: '#FFFFFF 0% 0% no-repeat padding-box',
      padding: "25px 15px 15px 15px"
    },
  },
  head: {
    fontSize: '16px',
    letterSpacing: "0.14px",
    lineHeight: "24px",
    color: "#000000DE",
    marginBottom: '25px'
  },
  inputControl: {
    marginBottom: "25px !important",
    '& label': {
      fontSize: '12px',
      color: "#00000061",
    },
    '& .MuiInputBase-formControl': {
      fontSize: '12px'
    },
    '& .MuiOutlinedInput-input': {
      padding: '13.5px 14px',
      fontSize: "16px",
      color: "#000000DE",
      letterSpacing: "3.2px",
      lineHeight: "24px"
    },
    '& .Mui-focused': {
      color: "#50BFB7 !important",
      borderColor: "#50BFB7 !important"
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: "#50BFB7 !important"
    },
  },
  cancel: {
    fontSize: '14px !important',
    letterSpacing: '1.25px !important',
    lineHeight: '16px !important',
    color: "#50BFB7 !important",
    border: "1px solid #50BFB7 !important",
    width: "100% !important",
    borderRadius: '4px !important',
    padding: "8px !important"
  },
  save: {
    fontSize: '14px !important',
    letterSpacing: '1.25px !important',
    lineHeight: '16px !important',
    color: "#000000BC !important",
    border: "1px solid #50BFB7 !important",
    width: "100% !important",
    background: "#50BFB7 0% 0% no-repeat padding-box !important",
    borderRadius: '4px !important',
    marginTop: '15px !important',
    padding: "8px !important"
  },
  errorForm: {
    color: 'red',
    fontSize: '12px',
    marginTop: '2px'
  },
  
}))

const DrawerRoot = styled(SwipeableDrawer)(() => ({
  "& .MuiBackdrop-root": {
      backgroundColor:"rgba(0, 0, 0, 0.65)"
  }
}))

function ChangePassword({ open, handleClose }) {
  const [values, setValues] = React.useState({
    currentPass: '',
    newPass: '',
    showPassword: false,
    showPassword1: false,
    errorMessages: {},
    isValidForm: false,
  });
  const dispatch = useDispatch();
  const { changePassword } = useAuth();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleClickShowPassword1 = () => {
    setValues({
      ...values,
      showPassword1: !values.showPassword1,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const classes = useStyles();


  const validatePaswords = (data, state) => {
    try {
      if (data.trim() == '') return 'Please enter password';
      if (state && data.length < 5) {
        return 'Password must be atleast 5 letters';
      } else {
        return '';
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validatePass = (event) => {
    let errors = values.errorMessages;
    let updatedValues = values;
    const isValid = (error) => {
      !error
        ? (updatedValues.isValidForm = true)
        : (updatedValues.isValidForm = false);
    };
    switch (event.target.name) {
      case 'currentPass':
        const validatePass = validatePaswords(event.target.value);
        errors.currentPass = validatePass;
        updatedValues.currentPass = event.target.value;
        updatedValues.isValidForm = event.target.value < 1 ? false : true;
        break;
      case 'newPass':
        errors.newPass =
          event.target.value == updatedValues.currentPass
            ? 'New password should not be same as current password'
            : validatePaswords(event.target.value, true);
        updatedValues.newPass = event.target.value;
        isValid(errors.newPass);
        break;
      default:
        break;
    }

    let errorCount = Object.values(errors);

    const result = errorCount.filter((e) => e);
    if (result.length == 0) {
      updatedValues.isValidForm = true;
    } else {
      updatedValues.isValidForm = false;
    }

    setValues({
      ...values,
      updatedValues,
      errorMessages: errors,
    });

  }

  const savePassword = async () => {
    for (var prop in values) {
      var event = {
        target: {
          value: values[prop],
          name: prop,
        },
      }
      validatePass(event)
    }
    let data = {
      currentPassword: values.currentPass,
      newPassword: values.newPass
    }
    // handle change password service call
    try {
        await changePassword(data);
        dispatch({
          type: SNACKBAR_SUCCESS.type,
          payload: 'Password Changed Successfully'
      })
    } catch (e) {
        dispatch({
          type: SNACKBAR_ERROR.type,
          payload: e.message
      })
    }
  }

  const closePopup = () => {
    setValues({
      currentPass: '',
      newPass: '',
      showPassword: false,
      showPassword1: false,
      errorMessages: {},
      isValidForm: false
    })
    handleClose();
  }

  const changePasswordForm = () => {
    return <Box
      component="form"
      sx={{ width: 'auto' }}
      noValidate
      autoComplete="off"
      role="presentation"
    >
      <FormControl fullWidth className={classes.inputControl}>
        <InputLabel htmlFor="outlined-adornment-password">Current Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showPassword ? 'text' : 'password'}
          value={values.currentPass}
          onChange={e => validatePass(e)}
          name="currentPass"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Current Password"
        />
        <div className={classes.errorForm}>
          {values.errorMessages.currentPass}
        </div>
      </FormControl>
      <FormControl fullWidth className={classes.inputControl}>
        <InputLabel htmlFor="outlined-adornment-password">New password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showPassword1 ? 'text' : 'password'}
          value={values.newPass}
          onChange={e => validatePass(e)}
          name="newPass"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword1}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showPassword1 ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="New password"
        />
        <div className={classes.errorForm}>
          {values.errorMessages.newPass}
        </div>
      </FormControl>
      <Grid mt={3}>
        <Button className={classes.cancel} onClick={closePopup}>CANCEL</Button>
        <Button disabled={Object.values(values.errorMessages).filter(v=>v).length} className={classes.save} onClick={savePassword}>SAVE PASSWORD</Button>
      </Grid>
    </Box>
  }

  return (
    <div>
      <DrawerRoot
        anchor={'bottom'}
        open={open}
        onClose={() => closePopup()}
        // onOpen={() => handleClose()}
        className={classes.drawerStyle}
      >
        <div className={classes.head}>Change Password</div>
        {changePasswordForm()}
      </DrawerRoot>
    </div>
  )
}

export default ChangePassword;