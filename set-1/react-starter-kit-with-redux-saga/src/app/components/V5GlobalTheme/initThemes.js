import { forEach, merge } from 'lodash'
import themeOptions from './themeOptions'
import { themeColors } from './themeColors'
import { createTheme } from '@mui/material'

function createV5GlobalThemes() {
    // let themes = {}

    // forEach(themeColors, (value, key) => {
    //     themes[key] = createTheme(merge({}, themeOptions, value))
    // })
    // return themes
    let themes = createTheme(merge({}, themeOptions, themeColors))
    return themes
}
export const themes = createV5GlobalThemes()
