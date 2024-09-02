import { getSecret } from '../AWS.js';

export function getConfigValue(key) {
    // Prefer the local environment over anything else
    if (process.env[key]) {
        return process.env[key];
    }

    if (!process.env.AWS) {
        try {
            const values = getSecret('vonage-workshop-secrets');
            return values[key];
        } catch (error) {
            console.error(error);
            return null;
        }
    } else {
        console.log(`config: Config value not found - ${key}`);
        return null;
    }
}
