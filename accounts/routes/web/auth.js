var express = require("express");
var router = express.Router();

// 导入 UserModel 模型
const UserModel = require("../../models/UserModel");
// 导入 md5 加密模块
const md5 = require("md5");

// 响应注册页面
router.get("/reg", (req, res) => {
  // 响应登录页面
  res.render("auth/reg", { title: "注册", action: "/reg" });
});

// 用户注册
router.post("/reg", (req, res) => {
  // 获取请求体的数据
  console.log(req.body);
  // 将数据插入到mongodb中    使用md5 将密码单向加密处理
  // 在插入前先判断是否存在该用户名，用户名作为唯一标识
  UserModel.findOne({ username: req.body.username }).then((data) => {
    res.render("success", { msg: "该用户名已存在", url: "/reg" });
  });
  UserModel.create({ ...req.body, password: md5(req.body.password) })
    .then((data) => {
      // 响应注册成功页面
      res.render("success", { msg: "注册成功", url: "/login" });
    })
    .catch((err) => {
      res.status(500), res.render("success", { msg: "注册失败", url: "/reg" });
    });
});

// 用户登录页面
router.get("/login", (req, res) => {
  res.render("auth/reg", { title: "登录", action: "/login" });
});

// 校验用户信息
router.post("/login", (req, res) => {
  // 在数据库中查找用户信息判断账号和密码是否匹配
  let { username, password } = req.body; // 解构获取 username 和 password
  UserModel.findOne({
    // 用户名和密码同时匹配
    username: username,
    password: md5(password),
  }).then((data) => {
    if (data !== null) {
      // 写入 session 返回sid
      req.session.username = data.username;
      req.session_id = data._id;
      // 匹配成功 重定向到账单页面
      return res.redirect("/account");
    }
    // 渲染登录失败页面
    res.render("success", { msg: "账号或密码错误", url: "/login" });
  });
});

// 退出登录
router.post("/logout", (req, res) => {
  req.session.destroy(() => {   // 清除session，将数据库中的session删除掉
    res.render("success", { msg: "退出登录,bey", url: "/login" });
  });
});

module.exports = router;
