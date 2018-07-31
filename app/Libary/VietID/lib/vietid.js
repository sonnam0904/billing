
/**
 * VietID Client
 *
 * @returns {{getAccessToken: getAccessToken, refreshToken: refreshToken, revokeToken: revokeToken, expired: expired, getUserInfo: getUserInfo}}
 * register url : localhost:3000/auth?vid_act=reg
 */
'use strict'

module.exports = function () {
    var config = require('./config');
    var qs = require('querystring');

    //VietID url

    /* Bản dev */
    //var OAUTH_BASE_URL = 'http://oauth.vietidv2.net/linkhay/';
    //var OAUTH_BASE_API_URL = 'http://api.vietidv2.net/';

    var OAUTH_BASE_URL = config.oauthBaseUrl;
    var OAUTH_BASE_API_URL = config.apiBaseUrl;
    var authorizationUrl = OAUTH_BASE_URL + 'authorize';
    var tokenUrl = OAUTH_BASE_URL + 'token';
    var revocationUrl = OAUTH_BASE_URL + 'oauth2/revoke';
    var userInfoUrl = OAUTH_BASE_API_URL + 'getInfo';

    /* Bản chính */
    /*
    var OAUTH_BASE_URL = 'https://oauth.vietid.net/vccorp/';
    var OAUTH_BASE_API_URL = 'https://api.vietidv2.net/';
    var authorizationUrl = OAUTH_BASE_URL + 'authorize';
    var tokenUrl = OAUTH_BASE_URL + 'token';
    var revocationUrl = OAUTH_BASE_URL + 'oauth2/revoke';
    var userInfoUrl = OAUTH_BASE_API_URL + '1.0/vccorp/getInfo';
    */

    config.authorizationUrl = authorizationUrl;
    config.tokenUrl = tokenUrl;
    config.revocationUrl = revocationUrl;

    var oauth2 = require('./oauth2')(config);
    var core = require('./core')(config);

    /**
     * Get access token
     *
     * @param HTTPRequest request
     * @param HTTPResponse response
     * @param string grantType
     * @param function callback
     */
    function getAccessToken(request, response, grantType, callback) {
        //Default grant type is 'authorization_code'
        if (typeof grantType === 'function') {
            callback = grantType;
            grantType = 'authorization_code';
        }

        //If callback is not a function
        if (!callback || typeof(callback) !== 'function') {
            throw new Error('Callback must be a function');
        }

        var code = request.code;
        var act = request.vid_act;
        var grant = '';
        //Get grant
        if (grantType == 'authorization_code') {
            grant = oauth2.authCode;
        }
        else if (grantType == 'client_credentials') {
            grant = oauth2.client;
        }
        else if (grantType == 'password') {
            grant = oauth2.password;
        }

        //If has code, request token
        //Else redirect to authorize url
        if (code) {
            var params = {code: code};
            grant.getToken(params, function (error, result) {
                if (error) {
                    return callback(error, null);
                }
                //Format token
                var token = oauth2.accessToken.create(result);
                callback(error, token);
            });
        } else {
            var error = request.error;
            var errorDescription = request.error_description;
            if(!error && !errorDescription){
                var param = (act) ? {'act_vid' : act} : {};
                var authorizeUrl = grant.authorizeURL(param);
                response.redirect(authorizeUrl);
            }else{
                callback(error, errorDescription);
            }
        }
    }

    function redirectLogin(request, response, grantType)
    {
        if ( typeof grantType == 'undefined' ) {
            grantType = 'authorization_code';
        }
        var grant;

        //Get grant
        if (grantType == 'authorization_code') {
            grant = oauth2.authCode;
        }
        else if (grantType == 'client_credentials') {
            grant = oauth2.client;
        }
        else if (grantType == 'password') {
            grant = oauth2.password;
        }

        var act = request.vid_act;
        var param = (act) ? {'act_vid' : act} : {};
        var authorizeUrl = grant.authorizeURL(param);
        response.redirect(authorizeUrl);
    }

    function setRedirectUri(url) {
        if (typeof url == 'undefined')
            url = 'http://v2.vietid.net';
        config.redirectUri = url;
    }

    function setClientID(client_id) {
        if (typeof client_id !== 'undefined') {
            config.clientID = client_id;
        }
    }

    function setClientSecret(client_secret) {
        if (typeof client_secret !== 'undefined') {
            config.clientSecret = client_secret;
        }
    }

    function redirectRegister(request, response, grantType)
    {
        if ( typeof grantType == 'undefined' ) {
            grantType = 'authorization_code';
        }
        var grant;

        //Get grant
        if (grantType == 'authorization_code') {
            grant = oauth2.authCode;
        }
        else if (grantType == 'client_credentials') {
            grant = oauth2.client;
        }
        else if (grantType == 'password') {
            grant = oauth2.password;
        }

        var param = {
            'act_vid' : 'reg'
        };
        var authorizeUrl = grant.authorizeURL(param);
        response.redirect(authorizeUrl);
    }

    /**
     * Function to get user info
     *
     * @param string accessToken
     */
    function getUserInfo(accessToken, callback){
        core.api('GET', userInfoUrl + '?access_token=' + accessToken, {}, callback);
    }

    /**
     * Function to refresh token
     *
     * @param callback (error, result) The callback function returning the results. An error object is passed as first argument
     */
    function refreshToken(callback) {
        oauth2.accessToken.refresh(callback);
    }

    /**
     * Function to refresh token
     *
     * @param string tokenType A String containing the type of token to revoke. Should be either "access_token" or "refresh_token"
     * @param callback (error, result)
     */
    function revokeToken(tokenType, callback) {
        oauth2.accessToken.revoke(callback);
    }

    /**
     * Function to refresh token
     *
     * @param callback (error, result)
     */
    function expired() {
        return oauth2.accessToken.expired();
    }

    function getUrlLogout(callback) {
        var urlLogout = OAUTH_BASE_URL + 'logout';
        var params = {
            'callback'  : callback,
            'client_id' : config.clientID
        };

        return urlLogout + '?' + qs.stringify(params);
    }

    return {
        'getAccessToken': getAccessToken,
        'setRedirectUri': setRedirectUri,
        'setClientID': setClientID,
        'setClientSecret': setClientSecret,
        'redirectLogin': redirectLogin,
        'redirectRegister': redirectRegister,
        'refreshToken': refreshToken,
        'revokeToken': revokeToken,
        'expired': expired,
        'getUserInfo': getUserInfo,
        'getUrlLogout' : getUrlLogout
    }
}