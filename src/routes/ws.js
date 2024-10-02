export default function(router) {
    router.ws('/ws', async (ws, req) => {
      ws.on('message', msg => {
        ws.send(JSON.stringify({
            'asdfsd': true
        }));
      });
    });
    return router;
}
