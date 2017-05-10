/**
 * Created by Hyungwu Pae on 5/5/17.
 */
'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controller/project.controller');

router.get('/', controller.listAll);
router.get('/github-sync', controller.githubSync);
router.get('/:id', controller.findProject);
router.get('/user/:userId', controller.findUserProjects);
router.post('/', controller.createProject);
router.put('/:id', controller.editProject);
router.put('/:id/skill', controller.addSkillToPjt);
router.put('/:id/skills', controller.addSkillsToPjt);
router.delete('/:id', controller.deleteProject);
module.exports = router;
