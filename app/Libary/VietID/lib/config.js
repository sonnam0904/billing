/**
 * Config for VietID Client
 *
 * - clientID - Required registered Client ID.
 * - clientSecret - Required registered Client secret.
 * - useBasicAuthorizationHeader - Whether or not the Authorization: Basic ... header is set on the request. Defaults to true.
 * - clientSecretParameterName - Parameter name for the client secret. Defaults to client_secret.
 */
module.exports = {
    'clientID': '057ee7c8032ed1faa1cfe6a3051785fb',
    'clientSecret': 'fee9667cd5c50c42d68f36fe4df9ba8a',
    'redirectUri': 'http://127.0.0.1:3333/callback',
    'scope': '',
    'useBasicAuthorizationHeader': true,
    'clientSecretParameterName': 'client_secret',
    //'oauthBaseUrl': 'http://oauth.vietidv2.net/vccorp/',
    //'apiBaseUrl': 'http://api.vietidv2.net/1.0/vccorp/'
    'oauthBaseUrl': 'https://oauth.vietid.net/vccorp/',
    'apiBaseUrl': 'https://api.vietid.net/1.0/vccorp/'
};
