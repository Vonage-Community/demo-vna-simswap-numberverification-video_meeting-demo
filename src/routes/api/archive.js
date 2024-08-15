import { getVonageClient } from "../../Vonage.js";

export default function(router) {
    router.get('/api/archive', async (req, res) => {
        const vonage = getVonageClient();
        let filter = {};
        if (req.query.count) {
          filter.count = req.query.count;
        }
        if (req.query.offset) {
          filter.offset = req.query.offset;
        }
        if (req.query.sessionId) {
          filter.sessionId = req.query.sessionId;
        }
        // list archives
        console.log('attempting to list archives');
        try {
          const archives = await vonage.video.searchArchives(filter);
          // extract as a JSON object
          res.setHeader('Content-Type', 'application/json');
          res.send(archives);
        } catch (error){
          console.error("error listing archives: ",error);
          res.status(500).send({ error: 'listArchives error:' + error });
        }
    });
    return router;
}

