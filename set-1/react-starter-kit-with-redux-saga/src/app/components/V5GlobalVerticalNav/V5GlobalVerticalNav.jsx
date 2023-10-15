import { styled, Box } from '@mui/system'
import React, { Fragment } from 'react'
import { convertHexToRGB } from 'utils'
import { NavLink } from 'react-router-dom'
import useSettings from 'app/hooks/useSettings'
import { Paragraph, Span } from '../Typography'
import { Icon, ButtonBase } from '@mui/material'
import V5GlobalVerticalNavExpansionPanel from './V5GlobalVerticalNavExpansionPanel'

const ListLabel = styled(Paragraph)(({ theme, mode }) => ({
    fontSize: '12px',
    marginTop: '20px',
    marginLeft: '15px',
    marginBottom: '10px',
    textTransform: 'uppercase',
    display: mode === 'compact' && 'none',
    color: theme.palette.text.secondary,
}))

const ExtAndIntCommon = {
    display: 'flex',
    overflow: 'hidden',
    borderRadius: '4px',
    height: 44,
    whiteSpace: 'pre',
    marginBottom: '8px',
    textDecoration: 'none',
    justifyContent: 'space-between',
    transition: 'all 150ms ease-in',
    // '&:hover': {
    //     background: 'rgba(255, 255, 255, 0.08)',
    // },
    '&.compactNavItem': {
        overflow: 'hidden',
        justifyContent: 'center !important',
    },
    '& .icon': {
        fontSize: '18px',
        paddingLeft: '16px',
        paddingRight: '16px',
        verticalAlign: 'middle',
        
    },
}
const ExternalLink = styled('a')(({ theme, menuColor }) => ({
    ...ExtAndIntCommon,
    color: theme.palette.text.primary,
    '&:hover': {
        background: `rgba(${menuColor}, 0.08)`
    }
}))

const InternalLink = styled(Box)(({ theme, menuColor }) => ({
    '& a': {
        ...ExtAndIntCommon,
        // color: theme.palette.text.primary,
        color:  `rgba(0, 0, 0, .5)`,
    },
    '& .navItemActive': {
        // backgroundColor: 'rgba(255, 255, 255, 0.16)',
        // backgroundColor: '#F1E3D5',
        backgroundColor: `rgba(${menuColor}, .5)`,
        color: 'rgba(0, 0, 0, 1)'
    },
}))

const StyledText = styled(Span)(({ mode }) => ({
    fontSize: '0.875rem',
    paddingLeft: '0.8rem',
    display: mode === 'compact' && 'none',
}))

const BulletIcon = styled('div')(({ theme }) => ({
    padding: '2px',
    marginLeft: '24px',
    marginRight: '8px',
    overflow: 'hidden',
    borderRadius: '300px',
    background: "transparent",
}))

const BadgeValue = styled('div')(() => ({
    padding: '1px 8px',
    overflow: 'hidden',
    borderRadius: '300px',
}))

const V5GlobalVerticalNav = ({ items, handleMenuClose }) => {
    const { settings } = useSettings()
    const { mode, menuColor } = settings.layout1Settings.leftSidebar
    const sideMenuColor = convertHexToRGB(menuColor);

    const renderLevels = (data) => {
        return data.map((item, index) => {
            if (item.type === 'label')
                return (
                    <ListLabel
                        key={index}
                        mode={mode}
                        className="sidenavHoverShow"
                    >
                        {item.label}
                    </ListLabel>
                )
            if (item.children) {
                return (
                    <V5GlobalVerticalNavExpansionPanel
                        mode={mode}
                        item={item}
                        key={index}
                        handleMenuClose={handleMenuClose}
                    >
                        {renderLevels(item.children)}
                    </V5GlobalVerticalNavExpansionPanel>
                )
            } else if (item.type === 'extLink') {
                return (
                    <ExternalLink
                        key={index}
                        href={item.path}
                        className={`${mode === 'compact' && 'compactNavItem'}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        menuColor={sideMenuColor}
                    >
                        <ButtonBase
                            key={item.name}
                            name="child"
                            sx={{ width: '100%' }}
                        >
                            {(() => {
                                if (item.icon) {
                                    return (
                                        <Icon className="icon">
                                            {item.icon}
                                        </Icon>
                                    )
                                } else {
                                    return (
                                        <span className="item-icon icon-text">
                                            {item.iconText}
                                        </span>
                                    )
                                }
                            })()}
                            <StyledText
                                mode={mode}
                                className="sidenavHoverShow"
                            >
                                {item.name}
                            </StyledText>
                            <Box mx="auto"></Box>
                            {item.badge && (
                                <BadgeValue>{item.badge.value}</BadgeValue>
                            )}
                        </ButtonBase>
                    </ExternalLink>
                )
            } else {
                return (
                    <InternalLink key={index} menuColor={sideMenuColor}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? `navItemActive ${mode === 'compact' && 'compactNavItem'}` : `${mode === 'compact' && 'compactNavItem'}`
                            }
                            onClick={handleMenuClose}
                        >
                            <ButtonBase
                                key={item.name}
                                name="child"
                                sx={{ width: '100%' }}
                                style={item.type ? { paddingLeft: '30px'}: {}}
                            >
                                {item?.icon ? (
                                    <Icon className="icon" sx={{ width: 36 }}>
                                        {item.icon}
                                    </Icon>
                                ) : (
                                        <Icon className="icon" sx={{ width: 36 }}>
                                            {item.name === "Reports" ? "table_chart" : "adjust"}
                                        </Icon>
                                )}
                                <StyledText
                                    mode={mode}
                                    className="sidenavHoverShow"
                                >
                                    {item.name}
                                </StyledText>
                                <Box mx="auto"></Box>
                                {item.badge && (
                                    <BadgeValue className="sidenavHoverShow">
                                        {item.badge.value}
                                    </BadgeValue>
                                )}
                            </ButtonBase>
                        </NavLink>
                    </InternalLink>
                )
            }
        })
    }

    return <div className="navigation">{renderLevels(items)}</div>
}

export default React.memo(V5GlobalVerticalNav)
