module.exports = {

    get_last_comment: `SELECT comment, user_id FROM comment WHERE slug = ?
      ORDER BY comment.created_at DESC LIMIT 1`,
    get_subscriptions: `SELECT endpoint, publicKey, auth FROM subscription`,
};
