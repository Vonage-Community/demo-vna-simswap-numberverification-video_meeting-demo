import { getVonageClient } from "../../../Vonage.js";

export default function(router) {
    router.post('/api/archive/:archiveId/stop', async (req, res) => {
        const vonage = await getVonageClient();
        const archiveId = req.params.archiveId;
        console.log('attempting to stop archive: ' + archiveId);
        try {
          const archive = await vonage.video.stopArchive(archiveId);
          res.setHeader('Content-Type', 'application/json');
          res.send(archive);
        } catch (error){
          console.error("error stopping archive: ",error);
          res.status(500).send({ error: 'stopArchive error:', error });
        }
    });
    return router;
}

