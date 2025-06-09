const instances = {};

export class SimSwap {
    constructor(vna) {
        this.vna = vna;
    }
    
    async hasBeenRecentlySwapped(phoneNumber, hours = 168) {
        const bearerToken = await this.vna.getBearerToken({
            login_hint: phoneNumber,
            scope: 'openid dpv:FraudPreventionAndDetection#check-sim-swap'
        });
        console.log(`sim-swap: Token ${bearerToken}`);

        const requestData = {
            phoneNumber,
            maxAge: hours
        };

        const response = await fetch('https://api-eu.vonage.com/camara/sim-swap/v040/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            },
            body: JSON.stringify(requestData)
        });

        const json = await response.json();
        console.log(`sim-swap: API Response ${JSON.stringify(json)}`);
        
        return json.swapped;
    }
}

export function getSimSwapService(vna) {
    const applicationID = vna.getApplicationID;
    if (!instances[applicationID]) {
        instances[applicationID] = new SimSwap(vna);
    }

    return instances[applicationID];
}
