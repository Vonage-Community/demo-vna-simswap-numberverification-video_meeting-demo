const instances = {};

export class NumberVerification {
    constructor(vna) {
        this.vna = vna;
    }
    
    getAuthURL(domain, phoneNumber, stateID) {
        const params = new URLSearchParams({
            client_id: this.vna.applicationID,
            redirect_uri: `https://${domain}/oauth/redirect`,
            response_type: 'code',
            scope: 'openid dpv:FraudPreventionAndDetection#number-verification-verify-read',
            state: stateID,
            login_hint: phoneNumber
        });

        return `https://oidc.idp.vonage.com/oauth2/auth?${params}`;
    }

    async check(code, phoneNumber) {
        const bearerToken = await this.vna.getBearerTokenByCode(code);

        const requestData = {
            phoneNumber,
        };

        const response = await fetch('https://api-eu.vonage.com/camara/number-verification/v031/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            },
            body: JSON.stringify(requestData)
        });

        const json = await response.json();
        
        return json.devicePhoneNumberVerified;
    }
}

export function getNumberVerificationService(vna) {
    const applicationID = vna.getApplicationID;
    if (!instances[applicationID]) {
        instances[applicationID] = new NumberVerification(vna);
    }

    return instances[applicationID];
}
