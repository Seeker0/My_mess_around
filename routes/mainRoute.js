'use strict';
const express = require('express');
const router = express.Router();
const client = require('../models/redis.js');

router.get('/', (req, res) => {
  if (req.cookies.userName) {
    console.log(req.cookies);
    res.redirect('/user');
  } else {
    res.render('login');
  }
});

router.get('/user', (req, res) => {
  console.log(req.cookies.userName);
  res.render('scypher');
});

router.post('/user', (req, res) => {
  res.cookie('userName', req.body.userName);
  res.render('scypher');
});

router.post('/', (req, res) => {});

module.exports = router;
