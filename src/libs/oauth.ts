import {
    FacebookAuthProvider,
    GoogleAuthProvider,
    inMemoryPersistence,
    setPersistence,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { OAuthProvider } from '@/api/models/user';
import { auth } from './auth';

let firebaseOAuthReadyPromise: Promise<void> | null = null;

/** Firebase OAuth 弹窗中由用户主动取消产生的错误码。 */
const FIREBASE_OAUTH_USER_CANCELLED_CODES = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request']);

/** 提前初始化 Firebase OAuth 持久化，避免点击后再 await 导致 Safari 拦截弹窗。 */
export const prepareFirebaseOAuth = (): Promise<void> => {
    if (!firebaseOAuthReadyPromise) {
        firebaseOAuthReadyPromise = setPersistence(auth, inMemoryPersistence);
    }

    return firebaseOAuthReadyPromise;
};

/** 判断 Firebase OAuth 错误是否来自用户主动关闭或取消弹窗。 */
export const isFirebaseOAuthUserCancelledError = (error: unknown): boolean => {
    const errorCode = error instanceof Error ? Reflect.get(error, 'code') : undefined;

    return typeof errorCode === 'string' && FIREBASE_OAUTH_USER_CANCELLED_CODES.has(errorCode);
};

/** 通过 Firebase Auth 获取指定第三方提供方的 ID Token。 */
export const getFirebaseOAuthIdToken = async (provider: OAuthProvider): Promise<string> => {
    const authProvider = provider === OAuthProvider.Google ? new GoogleAuthProvider() : new FacebookAuthProvider();
    authProvider.addScope('email');

    try {
        const credential = await signInWithPopup(auth, authProvider);
        return await credential.user.getIdToken();
    } finally {
        await signOut(auth).catch(() => undefined);
    }
};
