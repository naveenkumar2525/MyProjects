import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import Menu from '@mui/material/Menu';
import { ThemeProvider, makeStyles } from '@mui/styles';
import useSettings from 'app/hooks/useSettings';
// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: 12,
        marginLeft: 4,
        overflow: 'inherit',
        boxShadow: '0 0 2px 0 rgb(145 158 171 / 24%), 0 7px 2px -11px rgb(145 158 171 / 24%)',
        // border: `solid 1px ${theme.palette.grey[500_8]}`,
    },
    arrow: {
        // [theme.breakpoints.up('sm')]: {
        //     top: -7,
        //     zIndex: 1,
        //     width: 12,
        //     right: 20,
        //     height: 12,
        //     content: "''",
        //     position: 'absolute',
        //     borderRadius: '0 0 4px 0',
        //     transform: 'rotate(-135deg)',
        //     // background: theme.palette.background.paper,
        //     // borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
        //     // borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
        //     borderRight: `solid 1px #ccc`,
        //     borderBottom: `solid 1px #ccc`,
        // },
    },
    wrapper: {
        marginTop: '-8px !important',
        marginBottom: '-8px !important'
    }
}));

// ----------------------------------------------------------------------

PopoverMenu.propTypes = {
    children: PropTypes.node.isRequired,
    width: PropTypes.number,
    className: PropTypes.string,
};

function PopoverMenu({ children, width, className, anchorEl, onClose, ...other }) {
    const classes = useStyles();
    const { settings } = useSettings();


    // const handleClose = () => {
    //     setElement(null);
    // }

    return (
        // <Popover
        //     getContentAnchorEl={null}
        //     anchorEl={anchorEl}
        //     hideBackdrop={true}
        //     anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        //     transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        //     className={className}
        //     classes={{
        //         root: classes.root,
        //         paper: classes.paper,
        //     }}
        //     {...other}
        // >
        //     <span className={classes.arrow} />

        //     <Box sx={{ width: width, maxWidth: '100%' }}>{children}</Box>
        // </Popover>

        <Fragment>
            <ThemeProvider theme={settings.themes[settings.activeTheme]}>
                <Menu
                    getContentAnchorEl={null}
                    anchorEl={anchorEl}
                    hideBackdrop={true}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    classes={{
                        root: classes.root,
                        paper: classes.paper,
                    }}
                    onClose={onClose}
                    {...other}
                > 
                    <div className={classes.wrapper}>
                        {children}
                    </div>
                </Menu>
            </ThemeProvider>
        </Fragment>
    );
}

export default PopoverMenu;