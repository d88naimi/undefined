/**
 * Created by Hyungwu Pae on 5/4/17.
 */
'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controller/skill.controller');

router.get('/', controller.listAll);
router.get('/:id', controller.findSkill);
router.get('/project/:projectId', controller.findSkillOfProject);
router.post('/', controller.createSkill);
router.delete('/:id', controller.deleteSkill);
module.exports = router;
