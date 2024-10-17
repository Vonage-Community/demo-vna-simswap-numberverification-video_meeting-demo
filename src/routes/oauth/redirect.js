import { getVNAService } from './../../services/VNA.js';
import { getNumberVerificationService } from './../../services/NumberVerification.js';
import { getWebsocket } from '../../services/App.js';
import { getConfigValue } from '../../models/Config.js';
import { messageQueue } from '../../services/MessageQueue.js';

export default function(router) {
    router.get('/oauth/redirect', async (req, res) => {
        if (req.query?.code) {
            const vna = getVNAService(
                await getConfigValue('API_APPLICATION_ID'),
                await getConfigValue('PRIVATE_KEY')
             );
             const numberVerification = getNumberVerificationService(vna);
             const hasPassed = await numberVerification.check(req.query.code, '990123456');
             messageQueue.log('debug', `Number Verification returned: ${hasPassed}`);

             if (hasPassed) {
               const state = req.query.state;
               messageQueue.log('verification', state)

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
