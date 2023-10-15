import React from 'react'
// import { V5GlobalLogo } from 'app/components'
// import { Span } from '../../components/Typography'
import { styled, Box } from '@mui/system'
import useSettings from 'app/hooks/useSettings'
// import { useSelector } from 'react-redux';

const BrandRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: `url('/assets/images/loginBackground.png')`,
    padding: '20px 18px 30px 20px',
    marginBottom: "2rem"

}))

// const StyledSpan = styled(Span)(({ theme, mode }) => ({
//     fontSize: 18,
//     marginLeft: '.5rem',
//     display: mode === 'compact' ? 'none' : 'block',
// }))

const Brand = ({ children }) => {
    const { settings } = useSettings()
    const leftSidebar = settings.layout1Settings.leftSidebar
    const { mode } = leftSidebar
    const brandImage = {
        width: "40px",
        marginTop: "0.5rem"
    }
    return (
        <BrandRoot className='flex items-center'>
            <Box className="sidenavHoverShow mb-3">
                {children || null}
            </Box>
            {mode === "full" && <img style={brandImage} src={`/assets/images/brandIcon.png`} alt={""} />}
            {mode === "mobile" && <img style={brandImage} src={`/assets/images/brandIcon.png`} alt="" />}
            {/* <Box display="flex" alignItems="center" sx={{ display: mode === 'compact' ? 'none' : 'block' }}>
                <V5GlobalLogo />
            </Box> */}
        </BrandRoot>
    )
}

export default Brand
