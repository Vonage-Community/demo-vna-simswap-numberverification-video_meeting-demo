import { getSimSwapService } from './../services/SimSwap.js';
import { getVNAService } from './../services/VNA.js';

export default function(router) {
    router.get('/', async (req, res) => {
      const simSwap = getSimSwapService(getVNAService(
         process.env.API_APPLICATION_ID,
         process.env.PRIVATE_KEY
      ));

      const hasBeenSwapped = await simSwap.hasBeenRecentlySwapped('990123456');
      
      if (hasBeenSwapped) {
         res.render('error.twig', { rooms: rr.fetchRooms() });
      } else {
         res.redirect('/room');
      }
    });
    return router;
}
