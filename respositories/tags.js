const { Tag } = require("../models");

module.exports = {
  getAllTags() {
    return Tag.findAll();
  },
  getTag(id) {
    return Tag.findAll({
      where: {
        id: id,
      },
    });
  },
  getUserByName(name) {
    return Tag.findAll({
      where: {
        name: name,
      },
    });
  },
  addTag(tag) {
    // User.create(user);
    return Tag.create(tag);
  },
  updateTag(id, updates) {
    return Tag.update(updates, {
      where: {
        id: id,
      },
    });
  },
  deleteTag(id) {
    return Tag.destroy({
      where: {
        id: id,
      },
    });
  },
};
