import fetch from 'node-fetch';
import { tokenGenerate } from '@vonage/jwt';

const instances = {};

export class VNA {
    constructor(applicationID, privateKey) {
        this.applicationID = applicationID;
        this.privateKey = privateKey;
    }
    
    getApplicationID() {
        return this.applicationID;
    }

    async getBearerToken(data) {
        const additionalData = new URLSearchParams(data);
        const vonageJWT = tokenGenerate(this.applicationID, this.privateKey);
        const authResponse = await fetch('https://api-eu.vonage.com/oauth2/bc-authorize', {
            method: 'POST',
            body: additionalData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${vonageJWT}`
            }
        });
        const authJson = await authResponse.json();

        const camaraResponse = await fetch('https://api-eu.vonage.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${vonageJWT}`
            },
            body: new URLSearchParams({
                auth_req_id: authJson.auth_req_id,
                grant_type: 'urn:openid:params:grant-type:ciba'
            })
        });
        const camaraJson = await camaraResponse.json();

        return camaraJson.access_token;
    }

    async getBearerTokenByCode(code) {
        const vonageJWT = tokenGenerate(this.applicationID, this.privateKey);
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: `https://${process.env.DOMAIN}/oauth/redirect`
        });

        const camaraResponse = await fetch('https://api-eu.vonage.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${vonageJWT}`
            },
            body: body.toString()
        });
        const camaraJson = await camaraResponse.json();

        return camaraJson.access_token;
    }
}

export function getVNAService(applicationID, privateKey) {
    if (!instances[applicationID]) {
        instances[applicationID] = new VNA(applicationID, privateKey);
    }

    return instances[applicationID];
}
