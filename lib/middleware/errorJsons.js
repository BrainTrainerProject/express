'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function jwtNotValid() {
  return { error: {
      code: '500',
      message: 'JWT is not valid'
    } };
}

function undefinedToken() {
  return { error: {
      code: '500',
      message: 'The token is undefined'
    } };
}

function wrongAuthHeader() {
  return { error: {
      code: '500',
      message: 'Authorization header is empty or does not have the format: "Bearer <token>"'
    } };
}

function noMatchingProfile() {
  return { error: {
      code: '500',
      message: 'No matching profile found'
    } };
}

exports.default = { jwtNotValid: jwtNotValid, undefinedToken: undefinedToken, wrongAuthHeader: wrongAuthHeader, noMatchingProfile: noMatchingProfile };