import { Vonage } from "@vonage/server-sdk";
import { Auth } from '@vonage/auth';
import { getConfigValue } from './models/Config.js';

function getAuth() {
    const privateKeyString = getConfigValue('PRIVATE_KEY') || null;
    const applicationId = getConfigValue('API_APPLICATION_ID') || null;
    
    const authData = {
        apiKey: getConfigValue('API_KEY'),
        apiSecret: getConfigValue('API_SECRET')
    };
    
    if (privateKeyString && applicationId) {
        authData['privateKey'] = privateKeyString;
        authData['applicationId'] = applicationId;
    }

    return new Auth(authData);
}

export function getVonageClient() {
    return new Vonage(getAuth(), { appendUserAgent: 'vonage-aws-hackday-2024'})
}
