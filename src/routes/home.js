import { getRoomRepository } from './../models/RoomRepository.js';

export default function(router) {
    router.get('/', async (req, res) => {
       const rr = getRoomRepository();
       res.render('home.twig', { rooms: rr.fetchRooms() });
    });
    return router;
}
