const router = require('express').Router();
const movieController = require('../controllers/movie');

router.get('/',async (req, res) => {
    try{
        let data = [];
        if (req.query.toprated) data = await movieController.getTopRated();
        else if (req.query.popular) data = await movieController.getMostPopular();
        else if (req.query.genres) data = await movieController.discoverByGenre(req.query.genres,req.query.page);
        else if (req.query.query) data = await movieController.search(req.query.query,req.query.page);
        res.json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

router.get('/:id',async (req, res) => {   
    try{
        const data = await movieController.getById(req.params.id);
        res.json(data);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;