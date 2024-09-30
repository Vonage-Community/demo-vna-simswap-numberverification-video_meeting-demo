import { getRoomRepository } from './../../models/RoomRepository.js';

export default function(router) {
    router.get('/room', async (req, res) => {
       const rr = getRoomRepository();
       res.render('room_list.twig', { rooms: rr.fetchRooms() });
    });
    return router;
}
