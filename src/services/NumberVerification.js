const instances = {};

export class NumberVerification {
    constructor(vna) {
        this.vna = vna;
    }
    
    async getAuthURL(domain, phoneNumber, stateID) {
        const ne_uri = "https://api-eu.vonage.com/v0.1/network-enablement";
        const fraud_scope = "dpv:FraudPreventionAndDetection#number-verification-verify-read"
        phoneNumber = '+9904199802340';
        const response = await fetch(ne_uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.vna.getVonageJWT()}`
            },
            body: JSON.stringify({
                phone_number: phoneNumber,
                scopes: [fraud_scope],
                state: stateID,
            })
        }).then(res => res.json());
        console.log(phoneNumber)
        console.log(response.scopes[fraud_scope]);

        return response.scopes[fraud_scope]['auth_url'];
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
