// routes/bookRoutes.js
const express = require('express');
const router = express.Router();

const livreController = require('../controllers/livreController');

router.get('/', livreController.getAllLivre);

router.post('/', livreController.createLivre);

router.get('/:id', livreController.getLivreById);

router.delete('/:id', livreController.deleteLivre);

router.put('/:id', livreController.updateLivre);

module.exports = router;
