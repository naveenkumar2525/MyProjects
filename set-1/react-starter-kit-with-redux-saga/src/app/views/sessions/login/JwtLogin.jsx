import {
    Card,
    Grid,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    TextField,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    FormControl,
    Paper
} from '@mui/material'
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react'
import useAuth from 'app/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Box, styled, useTheme } from '@mui/system'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { Paragraph, Span } from 'app/components/Typography'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { SNACKBAR_ERROR } from 'app/redux/slices/snackbar';

const useStyles = makeStyles(({ palette, ...theme }) => ({
    card: {
        zIndex: 1,
        height: "35rem",
        padding: "4rem",
        position: "relative",
        height: "100vh",
        width: "80%",
        backgroundImage: `url('/assets/images/loginBackground.png')`,
        backgroundSize: "cover",
        margin: "0 auto"
    },
    cardMobile: {
        zIndex: 1,
        height: "35rem",
        padding: "4rem",
        position: "relative",
        height: "100vh",
        width: "100%",
        backgroundImage: `url('/assets/images/loginBackground.png')`,
        backgroundSize: "cover",
        margin: "0 auto"
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    logo: {
        width: "60px",
        height: "auto",
        display: "flex",
        margin: "0 auto"
    },
    hr: {
        opacity: 0.2
    },
    footerText: {
        color: '#51BFB6'
    },
    signInBtn: {
        background: "#1981A5 !important",
        padding: "1rem",
        color: "#fff !important",
        borderRadius: "10px"
    }
}));

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: 'center',
}))

const ContentBox = styled(Box)(() => ({
    height: '100%',
    padding: '32px',
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.01)',
}))

const IMG = styled('img')(() => ({
    width: '100%',
}))

const JWTRoot = styled(JustifyBox)(() => ({
    background: '#1A2038',
    minHeight: '100% !important',
    '& .card': {
        maxWidth: 800,
        borderRadius: 12,
        margin: '1rem',
    },
}))

const StyledProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '6px',
    left: '25px',
}))

const JwtLogin = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [loading, setLoading] = useState(false)
    const [userInfo, setUserInfo] = useState({
        email: 'jason@ui-lib.com',
        password: 'dummyPass',
    })
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        showPassword: false,
    });
    const [message, setMessage] = useState('')
    const { login } = useAuth()

    // const handleChange = ({ target: { name, value } }) => {
    //     let temp = { ...userInfo }
    //     temp[name] = value
    //     setUserInfo(temp)
    // }

    const { palette } = useTheme()
    const textError = palette.error.main
    const textPrimary = palette.primary.main
    const dispatch = useDispatch();

    const handleChange = (prop) => (event) => {
        const { value } = event.target;
        setValues({ ...values, [prop]: value });
    };

    const handleFormSubmit = async (event) => {
        setLoading(true)
        try {
            await login(values.username, values.password);
            navigate('/');
        } catch (e) {
            setLoading(false);
             // handle change password service call
            dispatch({
                type: SNACKBAR_ERROR.type,
                payload: e.message
            });
        }
    }

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    let isMobile = window.mobileCheck = function () {
        let check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };
    return (
        // <JWTRoot>
        //     <Card className="card">
        //         <Grid container>
        //             <Grid item lg={5} md={5} sm={5} xs={12}>
        //                 <JustifyBox p={4} height="100%">
        //                     <IMG
        //                         src="/assets/images/illustrations/dreamer.svg"
        //                         alt=""
        //                     />
        //                 </JustifyBox>
        //             </Grid>
        //             <Grid item lg={7} md={7} sm={7} xs={12}>
        //                 <ContentBox>
        //                     <ValidatorForm onSubmit={handleFormSubmit}>
        //                         <TextValidator
        //                             sx={{ mb: 3, width: '100%' }}
        //                             variant="outlined"
        //                             size="small"
        //                             label="Email"
        //                             onChange={handleChange}
        //                             type="email"
        //                             name="email"
        //                             value={userInfo.email}
        //                             validators={['required', 'isEmail']}
        //                             errorMessages={[
        //                                 'this field is required',
        //                                 'email is not valid',
        //                             ]}
        //                         />
        //                         <TextValidator
        //                             sx={{ mb: '12px', width: '100%' }}
        //                             label="Password"
        //                             variant="outlined"
        //                             size="small"
        //                             onChange={handleChange}
        //                             name="password"
        //                             type="password"
        //                             value={userInfo.password}
        //                             validators={['required']}
        //                             errorMessages={['this field is required']}
        //                         />
        //                         <FormControlLabel
        //                             sx={{ mb: '12px', maxWidth: 288 }}
        //                             name="agreement"
        //                             onChange={handleChange}
        //                             control={
        //                                 <Checkbox
        //                                     size="small"
        //                                     onChange={({
        //                                         target: { checked },
        //                                     }) =>
        //                                         handleChange({
        //                                             target: {
        //                                                 name: 'agreement',
        //                                                 value: checked,
        //                                             },
        //                                         })
        //                                     }
        //                                     checked={userInfo.agreement || true}
        //                                 />
        //                             }
        //                             label="Remeber me"
        //                         />

        //                         {message && (
        //                             <Paragraph sx={{ color: textError }}>
        //                                 {message}
        //                             </Paragraph>
        //                         )}

        //                         <FlexBox mb={2} flexWrap="wrap">
        //                             <Box position="relative">
        //                                 <Button
        //                                     variant="contained"
        //                                     color="primary"
        //                                     disabled={loading}
        //                                     type="submit"
        //                                 >
        //                                     Sign in
        //                                 </Button>
        //                                 {loading && (
        //                                     <StyledProgress
        //                                         size={24}
        //                                         className="buttonProgress"
        //                                     />
        //                                 )}
        //                             </Box>
        //                             <Span sx={{ mr: 1, ml: '20px' }}>or</Span>
        //                             <Button
        //                                 sx={{ textTransform: 'capitalize' }}
        //                                 onClick={() =>
        //                                     navigate('/session/signup')
        //                                 }
        //                             >
        //                                 Sign up
        //                             </Button>
        //                         </FlexBox>
        //                         <Button
        //                             sx={{ color: textPrimary }}
        //                             onClick={() =>
        //                                 navigate('/session/forgot-password')
        //                             }
        //                         >
        //                             Forgot password?
        //                         </Button>
        //                     </ValidatorForm>
        //                 </ContentBox>
        //             </Grid>
        //         </Grid>
        //     </Card>
        // </JWTRoot>

        <Grid container>
            <Grid item sm={4} sx={{ display: { xs: 'none', sm: 'block' }}}></Grid>
            <Grid xs={12} sm={4}>
                <Grid className={`${isMobile() ? classes.cardMobile : classes.card} p-6`}>
                    <Grid style={{ marginTop: `${isMobile() && "8rem"}` }}>
                        <img src={`/assets/images/brandIcon.png`} alt={"Logo"} className={`${classes.logo}`} />
                        <h5 className='mt-10 h1 text-white font-medium text-30'>Sign In</h5>
                    </Grid>
                    <Grid>
                        <ValidatorForm onSubmit={handleFormSubmit}>
                            <TextField
                                className="w-full mt-4 bg-white border-radius-10"
                                    // id="outlined-adornment-password"
                                    type={'text'}
                                    value={values.username}
                                    onChange={handleChange('username')}
                                placeholder="User Name"
                                />
                            <FormControl className="w-full mt-5 bg-white border-radius-10" variant="outlined">

                                <TextField                  
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    onChange={handleChange('password')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                    edge="end">
                                                    {values.showPassword ? <VisibilityOffOutlinedIcon style={{ color: "#1981A5" }} /> : <VisibilityOutlinedIcon style={{ color: "#1981A5" }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    placeholder="Password"
                                />
                            </FormControl>

                            <Grid className="mt-8 mb-4">
                                <Button fullWidth
                                    variant="contained"
                                    disabled={loading || !values.username || !values.password}
                                    type="submit"
                                    className={classes.signInBtn}
                                >
                                    SIGN IN
                                </Button>
                                {loading && (
                                    <CircularProgress
                                        size={24}
                                        className={
                                            classes.buttonProgress
                                        }
                                    />
                                )}
                            </Grid>

                            <Grid className='mb-10 flex justify-start items-center'>
                                <small style={{ opacity: "0.8", fontSize: "0.8rem", color: "#fff" }}>For Troubleshoot</small>
                                <small className={`${classes.footerText} px-2 text-white`}>CALL ADMIN</small>
                            </Grid>

                        </ValidatorForm>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default JwtLogin
