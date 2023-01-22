import AsyncStorage from '@react-native-async-storage/async-storage'

export const isEmpty = (value) => {
    return (value === '' || value === null || value === undefined || (value != null && typeof value === 'object' && !Object.keys(value).length))
  }

  export const setStoreData = async (key, value) => {
    try {
        const stringValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, stringValue);
    } catch (e) {
        console.log(e.message)
    }
}


export const getStoreData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            const data = JSON.parse(value);
            return data;
        } else {
            return null;
        }
        
    } catch (e) {
        console.log(e.message)
    }
}

export const removeStoreData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (e) {
        console.log(e.message)
    }
}