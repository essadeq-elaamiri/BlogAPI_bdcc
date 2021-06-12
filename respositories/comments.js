const { Comment } = require("../models");

module.exports = {
  getAllComments() {
    return Comment.findAll();
  },
  getComments(offset = 0, limit = 5) {
    // Skip 0 instances and fetch the 10 after that
    return Comment.findAll({ offset: offset, limit: limit });
  },
  getCommentsAndCount(offset = 0, limit = 5) {
    return Comment.findAndCountAll({ offset: offset, limit: limit });
  },
  getComment(id) {
    return Comment.findAll({
      where: {
        id: id,
      },
    });
  },
  getCommentsByArticleID(articleId) {
    return Comment.findAll({
      where: {
        ArticleId: articleId,
      },
    });
  },
  addComment(comment) {
    // User.create(user);
    return Comment.create(comment);
  },
  updateComment(id, updates) {
    return Comment.update(updates, {
      where: {
        id: id,
      },
    });
  },
  deleteComment(id) {
    return Comment.destroy({
      where: {
        id: id,
      },
    });
  },
};
