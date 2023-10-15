import React from 'react'
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Box, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';

function Multiselect(props) {
    const {
        roles,
        roleName,
        handleRoleChange,
        handleDelete,
        disabled
    } = props;
    const useStyles = makeStyles(() => ({
        InputLabel: {
            marginLeft: "1rem",
            //marginTop: "-0.3rem"
        },
        popupHeight: {
            maxHeight: "50px"
        },
        customBox: {
            display: 'flex', 
            flexWrap: 'nowrap', 
            gap: 4.9, 
            maxWidth: '300px', 
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                width: 'none',
                display: 'none'
            },
            '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
            }
        },
    }));
    const classes = useStyles();
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
            },
        },
        getContentAnchorEl: null,
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "center"
        },
        transformOrigin: {
            vertical: "top",
            horizontal: "center"
        },
        variant: "menu"
    };    
    return (
        <FormControl className={`w-full`}>
            <InputLabel className={classes.InputLabel} id="demo-multiple-checkbox-label">Site ID</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                label="teg"
                value={roleName}
                onChange={handleRoleChange}
                MenuProps={MenuProps}
                style={{ display: 'flex', alignItems: 'center', maxHeight: '56px'}}
                input={<OutlinedInput label="Select Roles" className={`w-full`} />}
                // renderValue={(selected) => selected.join(', ')}
                renderValue={(selected) => (
                    <Box className={classes.customBox}>
                        {selected.map((value) => (
                            <Chip style={{backgroundColor: "#fff", border: '1px solid #ccc'}} key={value} label={value} onDelete={()=>{handleDelete(value)}}/>
                        ))}
                    </Box>
                )}
                disabled={disabled? disabled: false}
            >
                {roles.map((role) => (
                    <MenuItem key={role.name} value={role.name} >
                        <ListItemText primary={role.name} />
                        <Checkbox color="primary" checked={roleName.indexOf(role.name) > -1} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

    )
}

export default Multiselect
