const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.post('/', cardController.createCard);
router.put('/move', cardController.moveCard);
router.put('/:id', cardController.updateCardTitle);

module.exports = router;
