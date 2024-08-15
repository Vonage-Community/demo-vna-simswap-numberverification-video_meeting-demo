export default function(router) {
    router.get('/room/:roomName', async (req, res) => {
       res.render('view.twig');
    });
    return router;
}
