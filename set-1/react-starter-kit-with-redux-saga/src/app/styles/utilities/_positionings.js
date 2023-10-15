import { makeStyles } from '@mui/styles';

export const positioningStyles = makeStyles(({ palette, ...theme }) => ({
    '@global': {
        '.self-start': { alignSelf: "flex-start" },
        '.hidden': { display: 'none' },
        '.block': { display: 'block !important' },
        '.inline-block': { display: 'inline-block !important' },
        '.flex': { display: 'flex' },
        '.flex-size':{flex:1},
        '.flex-column': { display: 'flex', flexDirection: 'column' },
        '.flex-wrap': { flexWrap: 'wrap' },
        '.flex-nowrap': { flexWrap: 'nowrap !important' },
        '.float-right': { float: 'right' },
        '.float-left': { float: 'left' },
        '.justify-start': { justifyContent: 'flex-start !important' },
        '.justify-center': { justifyContent: 'center' },
        '.justify-end': { justifyContent: 'flex-end' },
        '.justify-between': { justifyContent: 'space-between !important' },
        '.justify-around': { justifyContent: 'space-around' },
        '.items-center': { alignItems: 'center' },
        '.items-start': { alignItems: 'flex-start' },
        '.items-end': { alignItems: 'flex-end' },
        '.items-stretch': { alignItems: 'stretch' },
        '.flex-grow': { flexGrow: '1' },
        '.overflow-auto': { overflow: 'auto !important' },
        '.overflow-hidden': { overflow: 'hidden !important' },
        '.overflow-unset': { overflow: 'unset !important' },
        '.overflow-visible': { overflow: 'visible !important' },
        '.scroll-y': { overflowX: 'hidden', overflowY: 'auto' },
        '.scroll-x': { overflowY: 'hidden', overflowX: 'auto' },
        '.relative': { position: 'relative' },
        '.position-bottom': { position: 'absolute', bottom: '0' },
        '.position-bottom-right': { position: 'absolute', bottom: '0', right: '0' },
        '.position-top-left': { position: 'absolute', top: '0', left: '0' },
        '.text-center': { textAlign: 'center !important' },
        '.align-middle': { verticalAlign: 'middle' },
        '.text-right': { textAlign: 'right !important' },
        '.text-left': { textAlign: 'left' },
        '.x-center': { left: '50%', transform: 'translateX(-50%)' },
        '.y-center': { top: '50%', transform: 'translateY(-50%)' },
        '.z-index-1': { zIndex: 1 }
    },
}))