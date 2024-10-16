import { Vonage } from "@vonage/server-sdk";
import { Auth } from '@vonage/auth';
import { getConfigValue } from './models/Config.js';

async function getAuth() {
    const privateKeyString = await getConfigValue('PRIVATE_KEY') || null;
    const applicationId = await getConfigValue('API_APPLICATION_ID') || null;
    
    const authData = {
        apiKey: await getConfigValue('API_KEY'),
        apiSecret: await getConfigValue('API_SECRET')
    };
    
    if (privateKeyString && applicationId) {
        if (privateKeyString.startsWith('---')) {
            authData['privateKey'] = Buffer.from(privateKeyString);
        } else {
            authData['privateKey'] = Buffer.from(privateKeyString, 'base64');
        }
        authData['applicationId'] = applicationId;
    }

    return new Auth(authData);
}

export async function getVonageClient() {
    return new Vonage((await getAuth()), { appendUserAgent: 'vonage-aws-hackday-2024'})
}
