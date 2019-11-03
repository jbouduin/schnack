module.exports = {

    get_last_comment: `SELECT comment, user_id FROM comment WHERE slug = ?
      ORDER BY comment.created_at DESC LIMIT 1`,

    subscribe: `INSERT INTO subscription
      (endpoint, publicKey, auth)
      VALUES (?, ?, ?)`,

    unsubscribe: `DELETE FROM subscription
      WHERE endpoint = ?`,

    get_subscriptions: `SELECT endpoint, publicKey, auth FROM subscription`,
};
