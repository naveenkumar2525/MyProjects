export function getGroupType (searchInputText: string) {
    let searchText = searchInputText ? searchInputText.toString().trimEnd() : '';
    if (/^[a-z]?[A-Z\.]+$/.test(searchText)) {
        return 'acronym';
    } else if (/^\d+$/.test(searchText)) {
        return 'number';
    } else if (/^[a-zA-Z ]*$/.test(searchText)) {
        return 'text';
    } else {
        return 'special-character';
    }
}

export function getGroupColor(searchText: string, isSearched: boolean) {
    switch (getGroupType(searchText)) {
        case 'acronym':
            return 'rgba(225, 217, 255, 0.4)'
        case 'number':
            return 'rgba(255, 252, 208, 0.4)'
        case 'text':
            return 'rgba(232, 241, 255, 0.4)'
        case 'special-character':
            return 'rgba(203, 255, 225, 0.4)'
    }
}