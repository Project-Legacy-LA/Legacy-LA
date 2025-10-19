const UAParser = require('ua-parser-js');

function parseDevice(userAgent) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser: result.browser.name || 'Unknown Browser',
    os: result.os.name || 'Unknown OS',
    device: result.device.type || 'desktop'
  };
}

module.exports = { parseDevice };
