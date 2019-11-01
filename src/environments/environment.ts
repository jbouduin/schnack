export const environment = {
  production: false,

  schnackHostName: process.env.SCHNACK_HOST_NAME || 'localhost',
  schnackPort: 3000,
  schnackProtocol: 'http',

  oauthSecret: 'xxxxx',

  oauthTwitter: true,
  oauthTwitterConsumerKey: 'xxxxx',
  oauthTwitterConsumerSecret: 'xxxxx',

  oauthGitHub: false,
  oauthGitHubClientId: 'xxxxx',
  oauthGitHubClientSecret: 'xxxxx',

  oauthGoogle: false,
  oauthGoogleClientId: 'xxxxx',
  oauthGoogleClientSecret: 'xxxxx',

  oauthFacebook: false,
  oauthFacebookClientId: 'xxxxx',
  oauthFacebookClientSecret: 'xxxxx',

  oauthLinkedIn: false,
  oauthLinkedInClientId: 'xxxxx',
  oauthLinkedInClientSecret: 'xxxxx',

  oauthInstagram: false,
  oauthInstagramClientId: 'xxxxx',
  oauthInstagramClientSecret: 'xxxxx'
};
