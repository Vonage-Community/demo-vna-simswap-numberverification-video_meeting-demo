import { getSimSwapService } from './../services/SimSwap.js';
import { getVNAService } from './../services/VNA.js';
import { getNumberVerificationService } from './../services/NumberVerification.js';

export default function(router) {
    router.get('/qr-code', async (req, res) => {
      const vna = getVNAService(
         process.env.API_APPLICATION_ID,
         process.env.PRIVATE_KEY
      );
      const simSwap = getSimSwapService(vna);

      const hasBeenSwapped = await simSwap.hasBeenRecentlySwapped('990123456');
      
      if (hasBeenSwapped) {
         console.log('BAd path');
      } else {
         const numberVerification = getNumberVerificationService(vna);
         const url = numberVerification.getAuthURL(process.env.DOMAIN, '+990123456', 'qaergqaerg34r5');

         res.render('number_verification.twig', { 'verification_url': url });
      }
    });
    return router;
}
