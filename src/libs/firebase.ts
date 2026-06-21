import { type Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { config } from '@/constants/config';

/** Firebase Web SDK 客户端配置，值由 NEXT_PUBLIC_FIREBASE_* 环境变量注入。 */
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let _app: FirebaseApp | null = null;
let _analyticsPromise: Promise<Analytics | null> | null = null;

/** 懒初始化 Firebase app，OAuth 与 Analytics 共享同一个实例。 */
export function getFirebaseApp(): FirebaseApp | null {
    if (!firebaseConfig.apiKey) return null;

    if (!_app) {
        _app = getApps()[0] ?? initializeApp(firebaseConfig);
    }
    return _app;
}

/** 懒初始化 Firebase Analytics。 */
export function getFirebaseAnalytics(): Promise<Analytics | null> {
    if (typeof window === 'undefined') return Promise.resolve(null);

    if (!_analyticsPromise) {
        const app = getFirebaseApp();
        if (!app) return Promise.resolve(null);

        _analyticsPromise = isSupported()
            .then((supported) => {
                if (!supported) return null;
                if (config.isDev) {
                    console.log('[FirebaseAnalytics] config', {
                        measurementId: app.options.measurementId,
                        appId: app.options.appId,
                        projectId: app.options.projectId,
                    });
                }
                return getAnalytics(app);
            })
            .catch(() => null);
    }
    return _analyticsPromise;
}
