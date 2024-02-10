const express = require("express");
// 创建路由对象
const router = express.Router();
// 导入 lowdb
/* const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
// 将数据存放到 db.json 文件中
const adapter = new FileSync(__dirname + "/../data/db.json");
// 获取 db 对象
const db = low(adapter);
// 导入 shortid  用于将json数据自动编号
const shortid = require("shortid"); */
// 导入 moment 用于格式化时间
const moment = require("moment");

// 导入 AccountModel 模型
const AccountModel = require("../../models/AccountModel");

// 导入checkLoginMiddleware路由中间价，用于session判断，检测是否登录
const checkLoginMiddleware = require("../../middlewares/checkLoginMiddleware");

// 添加首页的路由规则
router.get("/",(req,res)=>{
  //将路由根目录/  重定向到 /account 页面
  res.redirect("/account"); 
})

// 记账本的列表页面
router.get("/account", checkLoginMiddleware, function (req, res, next) {
  // 使用 lowdb
  /*   // 获取到 db.json 中 accounts 对象存储的所有账单数据
  let accounts = db.get("accounts").value(); */
  // 读取mongodb数据库中 accounts集合数据
  AccountModel.find()
    .sort({ time: -1 }) // 按照添加时间降序排列
    .then((data) => {
      res.render("list", { accounts: data, moment });
      // 动态渲染到账单列表中 并将momemt对象传入到模板中
    })
    .catch((err) => {
      res.status(500);
      res.render("success", { msg: "出错了", url: "/account/create" });
    });
});

// 添加记录页面
router.get("/account/create", checkLoginMiddleware, function (req, res, next) {
  res.render("create");
});

// 新增记录/处理获取到的表单数据
router.post("/account", checkLoginMiddleware, (req, res) => {
  console.log(req.body); // 获取请求体的数据
  // req.body 以对象形式获取到表单的数据，name为键名，value为值
  /* 添加到lowdb 数据库中 
  // 生成 id
  let id = shortid.generate();
  // 将获取到的数据保存到 db.json中
  db.get("accounts")
    .unshift({ id: id, ...req.body }) // 逆序插入
    .write();
  // 渲染成功添加的页面 并传递参数 */

  // 将time: '2024-02-10' 转换为 new Date
  // 2024-02-10 => moment => new Date
  // 插入到 mongodb 数据库
  AccountModel.create({
    ...req.body, // ES6 解构
    // 修改time属性的值
    time: moment(req.body.time).toDate(),
  })
    .then((data) => {
      res.render("success", { msg: "添加成功~", url: "/account" });
    })
    .catch((err) => {
      res.render("success", { msg: "添加失败~", url: "/account" });
    });
});

// 删除记录
router.get("/account/delete", checkLoginMiddleware, (req, res) => {
  // 获取传递来的 id
  let id = req.query.id;
  /*  // lowdb
  // 删除db.json 中的对应 id 的数据
  db.get("accounts").remove({ id }).write(); */

  // 删除mongodb中的数据
  AccountModel.deleteOne({ _id: id })
    .then((date) => {
      // 重定向到列表页 即将地址栏的 地址改为 /account
      res.redirect("/account");
      // 或渲染一个删除成功的页面
      // res.render('success',{msg:"删除成功",url:"/account"})
    })
    .catch((err) => {
      res.render("success", { msg: "删除失败", url: "/account" });
    });
});

module.exports = router;
