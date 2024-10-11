import { getVNAService } from './../../services/VNA.js';
import { getNumberVerificationService } from './../../services/NumberVerification.js';
import { getWebsocket } from '../../services/App.js';
import { getConfigValue } from '../../models/Config.js';


export default function(router) {
    router.get('/oauth/redirect', async (req, res) => {
        if (req.query?.code) {
            const vna = getVNAService(
                await getConfigValue('API_APPLICATION_ID'),
                await getConfigValue('PRIVATE_KEY')
             );
             const numberVerification = getNumberVerificationService(vna);
             const hasPassed = await numberVerification.check(req.query.code, '990123456');

             if (hasPassed) {
                const ws = getWebsocket();

                for (const client of ws.clients) {
                  const state = req.query.state;
                  const message = {};
                  message[state] = true
                  client.send(JSON.stringify(message));
                }

               res.render('number_verification_success.twig');
             } else {
               res.render('number_verification_error.twig');
             }
        } else {
            res.render('number_verification_error.twig');
        }
    });
    return router;
}
