import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const customConfig = {
  dictionaries: [adjectives, colors],
  separator: '-',
  length: 2,
};

export default function(router) {
    router.get('/generate-room', async (req, res) => {
        const shortName = uniqueNamesGenerator(customConfig);
        res.redirect(`/room/${shortName}`);
    });
    return router;
}
