import { AsyncStorage } from "react-native";

export default {
    async getBool(key) {
        const value = await AsyncStorage.getItem(key);
        return !value ? false : (value.toLowerCase() == `true`);
    },

    setBool(key, value) {
        AsyncStorage.setItem(key, `${value}`);
    },

    async getInt(key) {
        const value = await AsyncStorage.getItem(key);
        return !value ? 0 : parseInt(value);
    },

    setInt(key, value) {
        AsyncStorage.setItem(key, `${value}`);
    },

    async getString(key) {
        const value = await AsyncStorage.getItem(key);
        return !value ? '' : value;
    },

    setString(key, value) {
        AsyncStorage.setItem(key, `${value}`);
    }
}