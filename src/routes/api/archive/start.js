import { getRoomRepository } from "../../../models/RoomRepository.js";
import { getVonageClient } from "../../../Vonage.js";

export default function(router) {
    router.post('/api/archive/start', async (req, res) => {
        console.log('attempting to start archive');
        const vonage = await getVonageClient();
        const rr = getRoomRepository();
        const json = req.body;
        const sessionId = json.sessionId;
        try {
          const archive = await vonage.video.startArchive(sessionId, { name: rr.findRoomFromSessionId(sessionId) });
          console.log("archive: ", archive);
          res.setHeader('Content-Type', 'application/json');
          res.send(archive);
        } catch (error){
          console.error("error starting archive: ",error);
          res.status(500).send({ error: 'startArchive error:' + error });
        }
    });
    return router;
}
