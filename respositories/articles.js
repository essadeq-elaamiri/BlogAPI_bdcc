const { Article } = require("../models");

module.exports = {
  getAllArticles() {
    return Article.findAll();
  },
  getArticles(offset = 0, limit = 5) {
    // Skip 0 instances and fetch the 10 after that
    return Article.findAll({ offset: offset, limit: limit });
  },
  getArticlesAndCount(offset = 0, limit = 5) {
    return Article.findAndCountAll({ offset: offset, limit: limit });
  },
  getArticle(id) {
    return Article.findAll({
      where: {
        id: id,
      },
    });
  },
  getArticleByTitle(title) {
    return Article.findAll({
      where: {
        title: title,
      },
    });
  },
  addArticle(article) {
    // User.create(user);
    return Article.create(article);
  },
  updateArticle(id, updates) {
    return Article.update(updates, {
      where: {
        id: id,
      },
    });
  },
  deleteArticle(id) {
    return Article.destroy({
      where: {
        id: id,
      },
    });
  },
};
