import { jwtToAddress } from '@mysten/zklogin';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SALT = import.meta.env.VITE_ZKLOGIN_SALT;

export const getGoogleOAuthUrl = () => {
    const redirectUri = window.location.origin;
    // For MVP, we use a simple random nonce. 
    // In a full implementation, this should be derived from an ephemeral public key and epoch.
    const nonce = 'test_nonce_' + Math.random().toString(36).substring(2);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'id_token',
        redirect_uri: redirectUri,
        scope: 'openid email profile',
        nonce: nonce,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const parseJwtFromUrl = (hash: string) => {
    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const idToken = params.get('id_token');
    return idToken;
};

export const getSuiAddressFromJwt = (jwt: string) => {
    return jwtToAddress(jwt, SALT);
};
