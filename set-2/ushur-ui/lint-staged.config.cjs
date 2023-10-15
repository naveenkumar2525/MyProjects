module.exports = {
  '{src,scripts}/**/*.{js,ts,jsx,tsx}': (files) => {
    const isAppFolderChanges = files.some((fileName) =>
      fileName.includes('/ushur-ui/'),
    )
    const scripts = [
      `eslint ${files.join(' ')}`,
    ]
    return isAppFolderChanges ? scripts : []
  },
}
  
