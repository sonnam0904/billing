//
// ### Wrapper for the Access Token object
//

'use strict';

module.exports = function (config) {

    var core = require('./../core')(config);

    //
    // ### Creates an OAuth2.AccessToken instance.
    //
    // * `token` - An object containing the token object returned from the OAuth2 server.
    //

    function AccessToken(token) {
        this.token = {
            accessToken: token.access_token,
            expires: Math.floor(new Date().getTime()/1000) + parseInt(token.expires_in),
            refreshToken: token.refresh_token
        };
    }

    function create(token) {
        return new AccessToken(token);
    }

    //
    // ### Check if the access token is expired or not.
    //
    function expired() {
        return (this.token.expires < Math.floor(new Date().getTime()/1000)) ? true : false;
    }

    //
    // ### Refresh the access token
    //
    // * `callback` - The callback function returning the results.
    // An error object is passed as first argument and the new OAuth2.AccessToken
    // as last.
    //
    function refresh(callback) {
        var params = {grant_type: 'refresh_token', refresh_token: this.token.refreshToken};
        var that = this;
        core.api('POST', config.tokenPath, params, function (error, result) {
            if (result) {
                result = that.create(result);
            }
            callback(error, result);
        });
    }

    //
    // ### Revoke access or refresh token
    //
    // * `token_type` - A String containing the type of token to revoke.
    // Should be either "access_token" or "refresh_token".
    // * `callback` - The callback function returning the results.
    // An error object is passed as first argument.
    //
    function revoke(token_type, callback) {
        var token = token_type === 'access_token' ? this.token.accessToken : this.token.refreshToken;
        var params = {token: token, token_type_hint: token_type};
        core.api('POST', config.revocationPath, params, callback);
    }

    return {
        'create': create,
        'expired': expired,
        'refresh': refresh,
        'revoke': revoke
    }
};
