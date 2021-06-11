var express = require("express");
var router = express.Router();
var tagRepo = require("../respositories/tags");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  var data = await tagRepo.getAllTags();
  //console.log(data);
  res.json(data);
  //res.send(data);
});
router.get("/:id", async function (req, res, next) {
  var data = await tagRepo.getTag(req.params.id);
  res.json(data);
  //res.send(data);
});
router.post("/", async function (req, res, next) {
  var tag = req.body;
  //var res_data =
  const addedTag = await tagRepo.addTag(tag);
  //res.json(data);
  res.json(addedTag);
  //res.json(res_data);
});

router.put("/", async function (req, res, next) {
  var tag = req.body;
  var result = await tagRepo.updateTag(tag.id, tag);
  //res.json(data);
  res.json(
    result[0] == 1
      ? { message: "les modification ont été enrégistrées!" }
      : { message: "les modification n'ont pas été enrégistrées!" }
  );
});

router.delete("/:id", async function (req, res, next) {
  await tagRepo.deleteTag(req.params.id);
  //res.json(result);
  res.json({ message: "deleted!" });
});
module.exports = router;
