import { getAuth } from 'firebase/auth';
import { getFirebaseApp } from '@/libs/firebase';

/** firebase实例 */
const app = getFirebaseApp();

if (!app) {
    throw new Error('Firebase config is missing');
}

export const auth = getAuth(app);
export default app;
