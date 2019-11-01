export const environment = {
  production: true,

  schnackHostName: process.env.SCHNACK_HOST_NAME || 'localhost',
  schnackPort: process.env.SCHNACK_PORT || 3000,
  schnackProtocol: 'https',

  oauthSecret: 'xxxxx',

  oauthTwitter: process.env.OAUTH_TWITTER || false,
  oauthTwitterConsumerKey: 'xxxxx',
  oauthTwitterConsumerSecret: 'xxxxx',

  oauthGitHub: process.env.OAUTH_GITHUB || false,
  oauthGitHubClientId: 'xxxxx',
  oauthGitHubClientSecret: 'xxxxx',

  oauthGoogle: process.env.OAUTH_GOOGLE || false,
  oauthGoogleClientId: 'xxxxx',
  oauthGoogleClientSecret: 'xxxxx',

  oauthFacebook: process.env.OAUTH_FACEBOOK || false,
  oauthFacebookClientId: 'xxxxx',
  oauthFacebookClientSecret: 'xxxxx',

  oauthLinkedIn: process.env.OAUTH_LINKEDIN || false,
  oauthLinkedInClientId: 'xxxxx',
  oauthLinkedInClientSecret: 'xxxxx',

  oauthInstagram: process.env.OAUTH_INSTAGRAM || false,
  oauthInstagramClientId: 'xxxxx',
  oauthInstagramClientSecret: 'xxxxx'
};
