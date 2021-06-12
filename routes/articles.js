var express = require("express");
var router = express.Router();
var articleRepo = require("../respositories/articles");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  var offset = isNaN(parseInt(req.query.offset))
    ? 0
    : parseInt(req.query.offset);
  var limit = isNaN(parseInt(req.query.limit)) ? 5 : parseInt(req.query.limit);
  var currentPage = offset / 5 + 1;
  //var data = await userRepo.getUsers(offset, limit);
  var data = await articleRepo.getArticlesAndCount(offset, limit);
  data["currentPage"] = currentPage;
  //console.log(data);
  res.json(data);
  //res.send(data);
});
router.get("/:id", async function (req, res, next) {
  var data = await articleRepo.getArticle(req.params.id);
  res.json(data);
  //res.send(data);
});
router.get("/articlesByUser/:id", async function (req, res, next) {
  var data = await articleRepo.getArticlesByUserID(req.params.id);
  res.json(data);
  //res.send(data);
});
router.post("/", async function (req, res, next) {
  var article = req.body;
  //var res_data =
  const addedArticle = await articleRepo.addArticle(article);
  //res.json(data);
  res.json(addedArticle);
  //res.json(res_data);
});

router.put("/", async function (req, res, next) {
  var article = req.body;
  var result = await articleRepo.updateArticle(article.id, article);
  //res.json(data);
  res.json(
    result[0] == 1
      ? { message: "les modification ont été enrégistrées!" }
      : { message: "les modification n'ont pas été enrégistrées!" }
  );
});

router.delete("/:id", async function (req, res, next) {
  await articleRepo.deleteArticle(req.params.id);
  //res.json(result);
  res.json({ message: "deleted!" });
});
module.exports = router;
