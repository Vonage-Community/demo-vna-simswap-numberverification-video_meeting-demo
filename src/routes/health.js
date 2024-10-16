export default function(router) {
    router.get('/_/health', async (req, res) => {
      res.sendStatus(200);
    });
    return router;
}
