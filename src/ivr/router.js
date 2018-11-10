''
const Router = require('express').Router;
const {preWelcome, welcome, menu, handleClosed, transcribe, hangup, planets} = require('./handler');
const {optionConfig, sesConfig} = require('../../src/config/config');

const router = new Router();

// POST: /ivr/welcome
router.post('/preWelcome', (req, res) => {
  res.send(preWelcome());
});

router.post('/welcome', (req, res) => {
  const option = optionConfig(false, new Date());
  console.log(option);
  res.send(welcome(option));
});

router.post('/handleClosed', (req, res) => {
  res.send(handleClosed());
});

router.post('/transcribe', (req, res) => {
  let { From, TranscriptionText, RecordingUrl} = req.body;

  const config = sesConfig();
  res.send(transcribe(config, From, TranscriptionText, RecordingUrl));
});

router.post('/hangup', (req, res) => {
  res.send(hangup());
});


// POST: /ivr/menu
router.post('/menu', (req, res) => {
  const digit = req.body.Digits;
  return res.send(menu(digit));
});

// POST: /ivr/planets
router.post('/planets', (req, res) => {
  const digit = req.body.Digits;
  res.send(planets(digit));
});

module.exports = router;
