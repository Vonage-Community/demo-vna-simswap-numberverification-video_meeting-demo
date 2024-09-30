import { getVNAService } from './../../services/VNA.js';
import { getNumberVerificationService } from './../../services/NumberVerification.js';

export default function(router) {
    router.get('/oauth/redirect', async (req, res) => {
        if (res.query?.code) {
            const vna = getVNAService(
                process.env.API_APPLICATION_ID,
                process.env.PRIVATE_KEY
             );
             const numberVerification = getNumberVerificationService(vna);
             const hasPassed = await numberVerification.check(req.query.code, '990123456');
       
             if (hasPassed) {
               res.redirect('/room');
             } else {
               res.render('number_verification_error.twig');
             }
        } else {
            res.render('number_verification_error.twig');
        }
    });
    return router;
}
