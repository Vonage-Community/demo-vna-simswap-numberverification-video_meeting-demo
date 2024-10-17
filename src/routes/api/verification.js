import { messageQueue } from "../../services/MessageQueue.js";

export default function(router) {
    router.get('/api/verification', async (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          });

          let lastEventID = req.header('Last-Event-ID') || 0;
          
          let connectionActive = true;
          req.on('close', () => {
            connectionActive = false;
            clearInterval(intervalId); // Clear the interval to stop sending messages
          });
        
          // Send a debug message every 3 seconds (for demonstration)
          const intervalId = setInterval(() => {
            const messages = messageQueue.getMessages('verification', parseInt(lastEventID));
            messages.forEach((msg) => {
                res.write(`id: ${msg.id}\n`);
                res.write(`data: ${msg.message}\n\n`)
                lastEventID = msg.id;
            });
          }, 1000);
    });
    return router;
}
