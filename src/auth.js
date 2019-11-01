const passport = require('passport');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const MastodonStrategy = require('passport-mastodon').Strategy;
const fetch = require('node-fetch');

const queries = require('./db/queries');
const config = require('./config');
const authConfig = config.get('oauth');
const trustConfig = config.get('trust');
const schnack_host = config.get('schnack_host');

const providers = [];

function getAuthorUrl(comment) {
    if (comment.user_url) return comment.user_url;
    switch (comment.provider) {
        case 'mastodon':
            return 'https://twitter.com/' + comment.name;
        case 'twitter':
            return 'https://twitter.com/' + comment.name;
        case 'github':
            return 'https://github.com/' + comment.name;
    }
}
