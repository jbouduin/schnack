module.exports = {

    get_last_comment: `SELECT comment, user_id FROM comment WHERE slug = ?
      ORDER BY comment.created_at DESC LIMIT 1`,

    approve: `UPDATE comment SET approved = 1 WHERE id = ?`,

    reject: `UPDATE comment SET rejected = 1 WHERE id = ?`,

    awaiting_moderation: `SELECT comment.id, slug, comment.created_at
      FROM comment INNER JOIN user ON (user_id=user.id)
      WHERE NOT user.blocked AND NOT user.trusted AND
       NOT comment.rejected AND NOT comment.approved
       ORDER BY comment.created_at DESC LIMIT 20`,

    subscribe: `INSERT INTO subscription
      (endpoint, publicKey, auth)
      VALUES (?, ?, ?)`,

    unsubscribe: `DELETE FROM subscription
      WHERE endpoint = ?`,

    get_subscriptions: `SELECT endpoint, publicKey, auth FROM subscription`,


};
