export default function(router) {
    router.get('/', async (req, res) => {
      res.render('home.twig');
    });
    return router;
}
