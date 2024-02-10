// 导入 jwt 用于校验token
const jwt = require("jsonwebtoken");
// 导入 config.js 配置文件 中的secret加密字符串
const { secret } = require("../config/config");

// 声明中间件，用于token的获取和校验
module.exports = (req, res, next) => {
  // 获取token
  let token = req.get("token");
  // 判断 token 是否存在
  if (!token) {
    return res.json({
      // 使用return 语句停止执行后续代码
      code: "2003",
      msg: "token缺失",
      data: null,
    });
  }
  // 校验token
  jwt.verify(token, secret, (err, data) => {
    if (err) {
      return res.json({
        code: "2004",
        msg: "token校验失败", // token过期或不正确
        data: null,
      });
    }
    // 保存当前登录用户信息
    req.user = data; // 将当前用户信息，保存到req的user属性中
    // token 存在且校验成功，继续执行后续中间件
    next();
    // 此处token只用于检验用户是token是否正确且token不过期，
    // 不用于获取用户信息再做数据匹配和获取
  });
};
