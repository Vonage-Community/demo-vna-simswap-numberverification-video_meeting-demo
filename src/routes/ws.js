export default function(router) {
    router.ws('/ws', async (ws, req) => {
      ws.on('message', msg => {
        console.log(msg)
      });
    });
    return router;
}
