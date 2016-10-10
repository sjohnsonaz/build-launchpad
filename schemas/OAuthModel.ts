import * as mongoose from 'mongoose';

/**
 * Schema definitions.
 */

var OAuthTokensModel = mongoose.model('OAuthTokens', new mongoose.Schema({
    accessToken: { type: String },
    accessTokenExpiresOn: { type: Date },
    clientId: { type: String },
    refreshToken: { type: String },
    refreshTokenExpiresOn: { type: Date },
    userId: { type: String }
}));

var OAuthClientsModel = mongoose.model('OAuthClients', new mongoose.Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array }
}));

var OAuthUsersModel = mongoose.model('OAuthUsers', new mongoose.Schema({
    email: { type: String, default: '' },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    username: { type: String }
}));

export default class OAuthModel {
    /**
     * Get access token.
     */
    static getAccessTokenfunction(bearerToken) {
        console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

        return OAuthTokensModel.findOne({ accessToken: bearerToken });
    }

    /**
     * Get client.
     */
    static getClient(clientId, clientSecret) {
        console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');

        return OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret });
    }

    /**
     * Get refresh token.
     */
    static getRefreshToken(refreshToken) {
        console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

        return OAuthTokensModel.findOne({ refreshToken: refreshToken });
    }

    /*
     * Get user.
     */
    static getUser(username, password) {
        console.log('in getUser (username: ' + username + ', password: ' + password + ')');

        return OAuthUsersModel.findOne({ username: username, password: password });
    }

    /**
     * Save token.
     */
    static saveToken(token, client, user) {
        console.log('in saveToken (token: ' + token + ')');

        var accessToken = new OAuthTokensModel({
            accessToken: token.accessToken,
            accessTokenExpiresOn: token.accessTokenExpiresOn,
            clientId: client.id,
            refreshToken: token.refreshToken,
            refreshTokenExpiresOn: token.refreshTokenExpiresOn,
            userId: user.id
        });

        return accessToken.save();
    }
}
