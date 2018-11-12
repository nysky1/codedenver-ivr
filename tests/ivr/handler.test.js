const {preWelcome, welcome} = require('../../src/ivr/handler');
const {optionConfig} = require('../../src/config/config');
const {convertHourToUTC,convertHoursTo24Hour} = require('../../src/utilities/utilities');

describe('convertHourToUTC', () => {
  const config = optionConfig(false,new Date());
  let tzOffset = new Date().getTimezoneOffset()/60;
  it('7 am = 14', () => {
    const hours = convertHourToUTC(config.today,22);
    console.log(hours);
    expect(hours).toBe(convertHoursTo24Hour(22-tzOffset));
  })
  it('8 am = 15', () => {
    const hours = convertHourToUTC(config.today,8);
    expect(hours).toBe(convertHoursTo24Hour(8-tzOffset));
  })
  it('5 pm (17+7) = 0', () => {
    const hours = convertHourToUTC(config.today,17);
    expect(hours).toBe(convertHoursTo24Hour(17-tzOffset));
  })
});

//NODE_ENV=test && ./node_modules/.bin/eslint . && ./node_modules/.bin/jest
describe('IvrHandler#PREWelcome', () => {
  it('should serve TwiML with welcome msg', () => {
    const config = optionConfig(true,new Date());
    console.log(config);
    const twiml = preWelcome(config);
    const count = countWord(twiml);

    console.log(twiml);
    // TwiML verbs
    expect(count('Play')).toBe(2);
    expect(count('Redirect')).toBe(2);

  }); 
});



describe('IvrHandler#Welcome', () => {

  it('should serve TwiML with debug = true, isClosed', () => {
    const config = optionConfig(true,new Date());
    console.log(config);
    const twiml = welcome(config);
    const count = countWord(twiml);

    expect(count('Redirect')).toBe(2);
  }); 
  it('should serve TwiML with debug = false, isClosed - Sunday', () => {
    const config = optionConfig(false,new Date("October 14, 2018 00:00:00 GMT-0600")); 
    const twiml = welcome(config);
    const count = countWord(twiml);

    expect(count('Redirect')).toBe(2);
  });
  it('should serve TwiML with debug = false, isClosed - Saturday', () => {
    const config = optionConfig(false,new Date("October 13, 2018 00:00:00 GMT-0600")); 
    const twiml = welcome(config);
    const count = countWord(twiml);

    expect(count('Redirect')).toBe(2);
  });
  it('should serve TwiML with debug = false, isClosed - Friday 2 AM', () => {
    const config = optionConfig(false,new Date("October 11, 2018 02:00:00 GMT-0600")); 
    const twiml = welcome(config);
    const count = countWord(twiml);

    expect(count('Redirect')).toBe(2);
  }); 
  it('should serve TwiML with debug = false, isClosed - Friday 5 PM', () => {
    const config = optionConfig(false,new Date("October 11, 2018 17:00:00 GMT-0600")); 
    const twiml = welcome(config);
    const count = countWord(twiml);

    expect(count('Redirect')).toBe(2);
  }); 
  it('should serve TwiML with debug = false, isClosed - False Monday 9 AM', () => {
    const config = optionConfig(false,new Date("October 8, 2018 09:00:00 GMT-0600")); 
    const twiml = welcome(config);
    const count = countWord(twiml);
    expect(count('Play')).toBe(2);
    expect(twiml).toContain('opening-1to5.wav');
  });
  it('should serve TwiML with debug = false, isClosed - False Tue 9 AM', () => {
    const config = optionConfig(false,new Date("October 9, 2018 09:00:00 GMT-0600")); 
    const twiml = welcome(config);
    const count = countWord(twiml);
    expect(count('Play')).toBe(2);
    expect(twiml).toContain('opening-1to5.wav');
  });
  it('should serve TwiML with debug = false, isClosed - False Wed 9 AM', () => {
    const config = optionConfig(false,new Date("October 10, 2018 09:00:00 GMT-0600")); 
    const twiml = welcome(config);
    const count = countWord(twiml);
    expect(count('Play')).toBe(2);
    expect(twiml).toContain('opening-1to5.wav');
  });
  it('should serve TwiML with debug = false, isClosed - False Thur 9 AM', () => {
    const config = optionConfig(false,new Date("October 11, 2018 09:00:00 GMT-0600")); 
    const twiml = welcome(config);
    const count = countWord(twiml);
    expect(count('Play')).toBe(2);
    expect(twiml).toContain('opening-1to5.wav');
  });
  it('should serve TwiML with debug = false, isClosed - False Friday 9 AM', () => {
    const config = optionConfig(false,new Date("October 12, 2018 09:00:00 GMT-0600")); 
    const twiml = welcome(config);
    const count = countWord(twiml);
    expect(count('Play')).toBe(2);
    expect(twiml).toContain('opening-1to5.wav');
  });
  
});



/**
 * Counts how many times a word is repeated
 * @param {String} paragraph
 * @return {String[]}
 */
function countWord(paragraph) {
  return (word) => {
    const regex = new RegExp(`\<${word}[ | \/?\>]|\<\/${word}?\>`);
    return (paragraph.split(regex).length - 1);
  };
}

