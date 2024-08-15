import { Vonage } from "@vonage/server-sdk";
import { Auth } from '@vonage/auth';

function getAuth() {
    const privateKeyString = process.env.PRIVATE_KEY || null;
    const applicationId = process.env.API_APPLICATION_ID || null;
    
    const authData = {
        apiKey: process.env.VONAGE_API_KEY,
        apiSecret: process.env.VONAGE_API_SECRET
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