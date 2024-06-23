const AccessControl = require('accesscontrol');

// let grantList = [
//     { role: 'admin', resource: 'profile', action: 'read:any', attributes: '*, !views' },
//     { role: 'user', resource: 'profile', action: 'read:own', attributes: '*' }
// ];
module.exports = new AccessControl();