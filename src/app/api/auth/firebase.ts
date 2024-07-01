import {getAuth} from 'firebase/auth'
import {initializeApp} from 'firebase/app'


interface AuthConfig {
    apiKey: string | undefined,
    authDomain: string | undefined, 
    projectId: string | undefined,
    storageBucket: string | undefined,
    messagingSenderId: string | undefined,
    appId: string | undefined
}

const firebaseConfig: AuthConfig = {
     apiKey: process.env.API_KEY,
     authDomain: process.env.AUTH_DOMAIN,
     projectId: process.env.PROJECT_ID,
     storageBucket: process.env.STORAGE_BUCKET,
     messagingSenderId: process.env.MESSAGINGID,
     appId: process.env.APP_ID
}


const firebaseApp: any = initializeApp(firebaseConfig)

export const firebaseAuth = getAuth(firebaseApp)


