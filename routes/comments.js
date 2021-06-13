var express = require("express");
var router = express.Router();
var commentRepo = require("../respositories/comments");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  var data = await commentRepo.getAllComments();
  res.json(data);
  //res.send(data);
});
router.get("/:id", async function (req, res, next) {
  var data = await commentRepo.getComment(req.params.id);
  res.json(data);
  //res.send(data);
});
router.get("/commentByArticle/:id", async function (req, res, next) {
  var data = await commentRepo.getCommentsByArticleID(req.params.id);
  res.json(data);
  //res.send(data);
});

router.get("/commentsCount/:id", async function (req, res, next) {
  /*
  (permettra d’exécuter une requête Group By article.id et d’afficher les titres des
  l’articles et le nombre de commentaires pour chaque article.
  */
  var data = await commentRepo.getCommentsCountByArticle(req.params.id);
  res.json(data);
  //res.send(data);
});

router.post("/", async function (req, res, next) {
  var comment = req.body;
  const addedComment = await commentRepo.addComment(comment);
  res.json(addedComment);
});

router.put("/", async function (req, res, next) {
  var comment = req.body;
  var result = await commentRepo.updateArticle(comment.id, comment);
  //res.json(data);
  res.json(
    result[0] == 1
      ? { message: "les modification ont été enrégistrées!" }
      : { message: "les modification n'ont pas été enrégistrées!" }
  );
});

router.delete("/:id", async function (req, res, next) {
  await commentRepo.deleteComment(req.params.id);
  res.json({ message: "deleted!" });
});
module.exports = router;
