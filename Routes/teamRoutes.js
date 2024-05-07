const express = require('express');
const router = express.Router();
const {addTeam,processResult,viewResults} = require('../Controller/teamController');

router.post('/add-team', addTeam);

router.post('/process-result', processResult);

router.get('/team-result', viewResults);

module.exports = router;
