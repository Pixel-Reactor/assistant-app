//We ask reverse because we want to know if we are online and if we dont know, we are offline
export const offlineMode = process.env.EXPO_PUBLIC_OFFLINE_MODE == 'false' ? false : true
console.log('offline mode?', offlineMode)