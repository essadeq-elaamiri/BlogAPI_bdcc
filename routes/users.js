var express = require("express");
var router = express.Router();
var userRepo = require("../respositories/users");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  var offset = isNaN(parseInt(req.query.offset))
    ? 0
    : parseInt(req.query.offset);
  var limit = isNaN(parseInt(req.query.limit)) ? 10 : parseInt(req.query.limit);
  var data = await userRepo.getUsers(offset, limit);
  console.log(data);
  //res.json(data);
  res.send(data);
});
router.get("/:id", async function (req, res, next) {
  var data = await userRepo.getUser(req.params.id);
  //res.json(data);
  res.send(data);
});
router.post("/", async function (req, res, next) {
  var user = req.body;
  await userRepo.addUser(user);
  //res.json(data);
  res.send("added!");
});

router.put("/", async function (req, res, next) {
  var user = req.body;
  await userRepo.updateUser(user.id, user);
  //res.json(data);
  res.send("updated!");
});

router.delete("/:id", async function (req, res, next) {
  await userRepo.deleteUser(req.params.id);
  //res.json(data);
  res.send("deleted!");
});
module.exports = router;
