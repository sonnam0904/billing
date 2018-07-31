/**
 * Authorization Code flow implementation
 *
 * @param config
 * @returns {{authorizeURL: authorizeURL, getToken: getToken}}
 */
'use strict'

module.exports = function (config) {

    var core = require('./../core')(config),
        qs = require('querystring');

    // ### Redirect the user to the authorization page
    //
    // * `params.redirectURI` - A String that represents the registered application URI where the
    // user is redirected after authorization.
    // * `params.scope` - A String that represents the application privileges.
    // * `params.state` - A String that represents an optional opaque value used by the client to
    // maintain state between the request and the callback.
    //
    function authorizeURL(params) {
        params = (typeof params != 'undefined')? params : {};
        params.response_type = 'code';
        params.client_id = config.clientID;
        params.redirect_uri = config.redirectUri;
        params.scope = config.scope;
        params.state = (typeof params.state != 'undefined')? params.state : randomString(32);

        return config.authorizationUrl + '?' + qs.stringify(params);
    }

    //
    // ### Returns the Access Token object.
    //
    // * `params.code` - Authorization code (from previous step).
    // * `params.redirectURI` - A String that represents the callback uri.
    // * `callback` - The callback function returning the results.
    // An error object is passed as first argument and the result as last.
    //
    function getToken(params, callback) {
        params.grant_type = 'authorization_code';
        params.client_id = config.clientID;
        params.redirect_uri = config.redirectUri;
        params.scope = config.scope;
        core.api('POST', config.tokenUrl, params, callback);
    }

    function randomString(length) {
        if ( typeof length == 'undefined' ) {
            length = 16;
        }
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    return {
        'authorizeURL': authorizeURL,
        'getToken': getToken
    }
};
