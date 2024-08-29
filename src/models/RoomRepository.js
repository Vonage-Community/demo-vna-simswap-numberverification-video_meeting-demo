import { findKey, keys } from 'lodash-es';
import { getVonageClient } from '../Vonage.js';

class RoomRepository {
    constructor() {
        this.roomToSessionIdDictionary = {};
    }

    async createSession(response, roomName, sessionProperties = {}, role = 'moderator') {
        let sessionId;
        let token;
        const vonage = getVonageClient();
        console.log(`Creating ${role} creds for ${roomName}`);
      
        if (this.roomToSessionIdDictionary[roomName]) {
          sessionId = this.roomToSessionIdDictionary[roomName];
          token = vonage.video.generateClientToken(sessionId, { role })
          response.setHeader('Content-Type', 'application/json');
          response.send({
            applicationId: process.env.API_APPLICATION_ID,
            sessionId: sessionId,
            token: token
          });
        } else {
          try {
            const session = await vonage.video.createSession(sessionProperties);
      
            // now that the room name has a session associated wit it, store it in memory
            // IMPORTANT: Because this is stored in memory, restarting your server will reset these values
            // if you want to store a room-to-session association in your production application
            // you should use a more persistent storage for them
            this.roomToSessionIdDictionary[roomName] = session.sessionId;
      
            // generate token
            token = vonage.video.generateClientToken(session.sessionId, { role });
            response.setHeader('Content-Type', 'application/json');
            response.send({
              applicationId: process.env.API_APPLICATION_ID,
              sessionId: session.sessionId,
              token: token
            });
          } catch(error) {
            console.error("Error creating session: ", error);
            response.status(500).send({ error: 'createSession error:' + error });
          }
        }
      }

    fetchRooms() {
        console.log(keys);
        return keys(this.roomToSessionIdDictionary);
    }

    findRoomFromSessionId(sessionId) {
        return findKey(this.roomToSessionIdDictionary, (value) => value === sessionId);
    }
}

let rr = null;

export function getRoomRepository() {
    if (rr === null) {
        rr = new RoomRepository();
    }

    return rr;
}
