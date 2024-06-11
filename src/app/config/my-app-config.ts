export default  {

    // json for open id connect
    oidc: {
        clientId: '0oahmgrqeeofgPhVq5d7',
        issuer: 'https://dev-22967929.okta.com/oauth2/default',
        redirectUri: 'http://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email']
        
        
        /**
         * scopes provide access to information about a user
         * openid: required for authentication request
         * profile: user's first name, last name, phone etc
         * email: user's email address
         */
    }

}
