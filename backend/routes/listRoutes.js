const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

router.post('/', listController.createList);
router.put('/:id', listController.updateListTitle);

module.exports = router;
