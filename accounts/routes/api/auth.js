var express = require("express");
var router = express.Router();

// 导入 UserModel 模型
const UserModel = require("../../models/UserModel");
// 导入 md5 加密模块
const md5 = require("md5");
// 导入 jwt
const jwt = require("jsonwebtoken");
// 导入 config.js 配置文件中的secret加密字符串
const { secret } = require("../../config/config");

// 登录操作
router.post("/login", (req, res) => {
  // 在数据库中查找用户信息判断账号和密码是否匹配
  let { username, password } = req.body; // 解构获取 username 和 password
  UserModel.findOne({
    // 用户名和密码同时匹配
    username: username,
    password: md5(password),
  })
    .then((data) => {
      if (data !== null) {
        // 创建当前用户token
        let token = jwt.sign(
          { _id: data._id, username: username }, // 用户数据
          secret, // 加密字符串
          {
            expiresIn: 60 * 60 * 24 * 7, // token 7天有效期
          }
        );
        // 响应token
        res.json({
          code: "0000",
          msg: "登录成功",
          data: token,
        });
      }
      // 用户名和密码不匹配，返回错误数据
      res.json({
        code: "2002",
        msg: "用户名或密码错误",
      });
    })
    .catch((err) => {
      //数据库查询失败返回数据
      return res.json({
        code: "2001",
        msg: "数据库读取失败",
        data: null,
      });
    });
});

// 退出登录
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    // 清除session，将数据库中的session删除掉
    res.render("success", { msg: "退出登录,bey", url: "/login" });
  });
});

module.exports = router;
