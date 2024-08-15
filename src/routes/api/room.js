import { getRoomRepository } from "../../models/RoomRepository.js";

export default function(router) {
    router.get('/api/room/:roomName', async (req, res) => {
        const rr = getRoomRepository();
        const roomName = req.params.roomName;
        const room = rr.createSession(res, roomName, { mediaMode:"routed" }, 'moderator');
    });
    return router;
}
