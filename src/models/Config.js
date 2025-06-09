export async function getConfigValue(key) {
    // Prefer the local environment over anything else
    if (process.env[key]) {
        return process.env[key];
    }

    console.log(`config: Config value not found - ${key}`);
    return null;
}
