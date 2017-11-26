'use strict';
const express = require('express');
const router = express.Router();
const client = require('../models/redis.js');
const promises = require('../lib/promises.js');

router.get('/', (req, res) => {
  if (req.cookies.userName) {
    res.redirect('/user');
  } else {
    res.render('login');
  }
});

router.get('/user', (req, res) => {
  console.log(req.cookies.userName);
  if (req.session.user) {
    res.render('scypher', { user: req.session.user });
  } else {
    res.render('scypher', { user: req.cookies });
  }
});

router.post('/user', (req, res) => {
  res.cookie('userName', req.body.userName);
  promises.setUser(req.body.userName);
  client.hgetall(req.body.userName, (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data);
    res.redirect('/user');
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('userName');
  console.log(res.cookies);
  res.redirect('/');
});

router.post('/user/pockets', (req, res) => {
  promises
    .setPocket(req.cookies.userName, req.body.pocketName)
    .then(data => {
      promises.setItems(
        req.cookies.userName,
        req.body.pocketName,
        req.body.itemName,
        req.body.link
      );
    })
    .then(data => promises.userBuilder(req.cookies.userName))
    .then(data => {
      if (req.session) {
        req.session.user = data;
        console.log(req.session.user);
      }
      res.render('scypher', { user: data });
    })
    .catch(err => console.log(err));
});

module.exports = router;
