const geoip = require('geoip-lite');

function lookupLocation(ip) {
  const geo = geoip.lookup(ip);
  if (!geo) return { city: 'Unknown', country: 'Unknown' };
  return { city: geo.city || 'Unknown', country: geo.country || 'Unknown' };
}

module.exports = { lookupLocation };
