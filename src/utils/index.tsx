export const getItem = (key: string) => {
    return sessionStorage.getItem(key)
}


export const setItem = (key: string, value: any) => {
    const values = typeof value === 'object' ? JSON.stringify(value) : value
    return sessionStorage.setItem(key, values)
}


export const removeItem = (key: string) => {
    return sessionStorage.removeItem(key)
}