import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-west-2' });

const secretsManager = new AWS.SecretsManager();

export async function getSecret(SecretId) {
    try {
        const data = await secretsManager.getSecretValue({ SecretId }).promise();

        if (data.SecretString) {
            return JSON.parse(data.SecretString);
        }

        console.error(`aws: Secret was not a string, check value - ${SecretId}`);
        throw new Error(`Secret value was not a string`);
    } catch (error) {
        console.error(`aws: Error fetching secret: ${SecretId}`);
        throw error;
    }
}
