'use strict';
const {chooseDayFile, convertHourToUTC} = require('../utilities/utilities');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const ses = require('node-ses');
const {mailConfig} = require('../../src/config/config');



/**
 * if weekend or before 8 of after 5
 * @param {config object} config 
 * returns true or false
 */
function isClosed(config) {
  // console.log(config.today);
  // console.log(config.today.getHours());
  // console.log(convertHourToUTC(config.today,14));
  // console.log('----------');

  //14 = 8 AM maybe, and 23 = 5 PM 
  let today = config.today;
  return (config.debug === true ||
    today.getDay() < 1 || today.getDay() > 5 ||
    today.getHours() < convertHourToUTC(config.today,14) || today.getHours() >= convertHourToUTC(config.today,23)) ? true : false;
}
/**
 * Returns a revised VoiceResponse object with VoiceMail recording and transcription
 * @param {voiceResponse object} vr 
 */
function sendToVoicemail(vr) {
  const voiceResponse = vr;
  voiceResponse.record({
    maxLength: 30,
    action: '/ivr/hangup',
    transcribeCallback: '/ivr/transcribe',
  });
  //Generally, this is never played b/c user hangs up
  voiceResponse.say({voice: 'man', language: 'en-US'}, 'No recording received. Goodbye');
  voiceResponse.hangup();
  return voiceResponse;
}

exports.handleClosed = function handleClosed() {
  const voiceResponse = new VoiceResponse();

  voiceResponse.play('https://s3.amazonaws.com/codedenver/ivr/outsidehours.wav');
  voiceResponse.play('https://s3.amazonaws.com/codedenver/ivr/leaveus.wav');

  let voiceResponseClosedToVoiceMail = sendToVoicemail(voiceResponse);
  return voiceResponseClosedToVoiceMail.toString();
};
exports.transcribe = function transcribe(config, ph, msg, wav) {
  const client = ses.createClient({ key: config.key, secret: config.secret });
  const errorConfig = mailConfig();
  client.sendEmail({
    to: errorConfig.errorEmailAddr
  , from: errorConfig.errorEmailAddr
  , subject: 'codeDenver IVR - New Message from: ' + ph
  , message: 'Hey,<br/>You have a new message from:' + '<br/><br/>' + 'Callback: ' + ph + '<br/>Message Transcription: ' + msg + '<br/>Listen to Msg: <a href="' + wav + '">Listen</a>'
  , altText: msg
 }, function (err, data, res) {
  console.log(data);
 });
}
exports.hangup = function hangup() {
  const voiceResponse = new VoiceResponse();

  voiceResponse.say({voice: 'man', language: 'en-US'}, 'Thanks for your message.  Goodbye');
  voiceResponse.hangup();

  return voiceResponse.toString();
}
exports.preWelcome = function preWelcome(option) {
  const twiml = new VoiceResponse();

  twiml.play('https://s3.amazonaws.com/codedenver/ivr/welcome.wav');
  twiml.redirect('/ivr/welcome');

  return twiml.toString();
};

exports.welcome = function welcome(config) {
  const voiceResponse = new VoiceResponse();

  if (isClosed(config)) {
    voiceResponse.redirect('/ivr/handleClosed');
    return voiceResponse.toString();
  }

  const gather = voiceResponse.gather({
    action: '/ivr/menu',
    numDigits: '3',
    method: 'POST',

  });
  gather.play('https://s3.amazonaws.com/codedenver/ivr/opening-1to5.wav', {loop: 3});
  return voiceResponse.toString();
};

exports.menu = function menu(digit) {
  const optionActions = {
    '1': sales,
    '2': programming,
    '3': ux,
    '4': cloud,
    '5': seo,
    '303': speak
  };

  return (optionActions[digit])
    ? optionActions[digit]()
    : redirectWelcome();
};

function programming() {
  const twiml = new VoiceResponse();

  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/ringing_3.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/' + chooseDayFile()
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/programming.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/another-customer.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/leaveus.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/talk.wav'
  );

  let voiceResponseClosedToVoiceMail = sendToVoicemail(twiml);
  return voiceResponseClosedToVoiceMail.toString();
}

/**
 * Returns Twiml
 * @return {String}
 */
function sales() {
  const twiml = new VoiceResponse();

  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/ringing_3.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/' + chooseDayFile()
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/sales.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/tied_up.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/leaveus.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/shwag.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/talk.wav'
  );

  let voiceResponseClosedToVoiceMail = sendToVoicemail(twiml);
  return voiceResponseClosedToVoiceMail.toString();
}
function ux() { //3
  const twiml = new VoiceResponse();

  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/ringing_3.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/' + chooseDayFile()
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/ux.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/another-customer.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/leaveus.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/talk.wav'
  );

  let voiceResponseClosedToVoiceMail = sendToVoicemail(twiml);
  return voiceResponseClosedToVoiceMail.toString();
}
function cloud() {
  const twiml = new VoiceResponse();

  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/ringing_3.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/' + chooseDayFile()
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/cloud.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/another-customer.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/leaveus.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/talk.wav'
  );

  let voiceResponseClosedToVoiceMail = sendToVoicemail(twiml);
  return voiceResponseClosedToVoiceMail.toString();
}
function seo() {
  const twiml = new VoiceResponse();

  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/ringing_3.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/' + chooseDayFile()
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/seo.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/another-customer.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/leaveus.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/talk.wav'
  );

  let voiceResponseClosedToVoiceMail = sendToVoicemail(twiml);
  return voiceResponseClosedToVoiceMail.toString();
}
function speak() {
  const twiml = new VoiceResponse();

  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/ringing_3.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/' + chooseDayFile()
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/another-customer.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/leaveus.wav'
  );
  twiml.play(
    'https://s3.amazonaws.com/codedenver/ivr/talk.wav'
  );

  let voiceResponseClosedToVoiceMail = sendToVoicemail(twiml);
  return voiceResponseClosedToVoiceMail.toString();
}

/**
 * Returns an xml with the redirect
 * @return {String}
 */
function redirectWelcome() {
  const twiml = new VoiceResponse();

  twiml.say('That option is not available, let me take you back.', {
    voice: 'male',
    language: 'en-US',
  });

  twiml.redirect('/ivr/welcome');

  return twiml.toString();
}
