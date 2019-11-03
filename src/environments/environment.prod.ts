export const environment = {
  allowAnonymous: process.env.SCHNACK_ALLOW_ANONYMOUS || false,
  dateFormat: null,
  production: true,

  schnackHostName: process.env.SCHNACK_HOST_NAME || 'localhost',
  schnackPort: process.env.SCHNACK_PORT || 3000,
  schnackProtocol: 'https',

  oauthSecret: 'xxxxx',

  oauthTwitter: process.env.SCHNACK_OAUTH_TWITTER || false,
  oauthTwitterConsumerKey: process.env.SCHNACK_OAUTH_TWITTER_CONSUMER_KEY || '',
  oauthTwitterConsumerSecret: process.env.SCHNACK_OAUTH_TWITTER_CONSUMER_SECRET || '',

  oauthGitHub: process.env.SCHNACK_OAUTH_GITHUB || false,
  oauthGitHubClientId: process.env.SCHNACK_OAUTH_GITHUB_CLIENT_ID || '',
  oauthGitHubClientSecret: process.env.SCHNACK_OAUTH_GITHUB_CLIENT_SECRET || '',

  oauthGoogle: process.env.SCHNACK_OAUTH_GOOGLE || false,
  oauthGoogleClientId: process.env.SCHNACK_OAUTH_GOOGLE_CLIENT_ID || '',
  oauthGoogleClientSecret: process.env.SCHNACK_OAUTH_GOOGLE_CLIENT_SECRET || '',

  oauthFacebook: process.env.SCHNACK_OAUTH_FACEBOOK || false,
  oauthFacebookClientId: process.env.SCHNACK_OAUTH_FACEBOOK_CLIENT_ID || '',
  oauthFacebookClientSecret: process.env.SCHNACK_OAUTH_FACEBOOK_CLIENT_SECRET || '',

  oauthLinkedIn: process.env.SCHNACK_OAUTH_LINKEDIN || false,
  oauthLinkedInClientId: process.env.SCHNACK_OAUTH_LINKEDIN_CLIENT_ID || '',
  oauthLinkedInClientSecret: process.env.SCHNACK_OAUTH_LINKEDIN_CLIENT_SECRET || '',

  oauthInstagram: process.env.SCHNACK_OAUTH_INSTAGRAM || false,
  oauthInstagramClientId: process.env.SCHNACK_OAUTH_INSTAGRAM_CLIENT_ID || '',
  oauthInstagramClientSecret: process.env.SCHNACK_OAUTH_INSTAGRAM_CLIENT_SECRET || ''
};
