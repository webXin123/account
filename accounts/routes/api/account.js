const express = require("express");
const router = express.Router();

// 导入 moment 用于格式化时间
const moment = require("moment");

// 导入 AccountModel 模型
const AccountModel = require("../../models/AccountModel");

// 引入校验token的中间件
const checkTokenMiddleware = require("../../middlewares/checkTokenMiddleware");

// 获取记账本全部数据接口
router.get("/account", checkTokenMiddleware, function (req, res, next) {
  console.log(req.user);
  // 读取mongodb数据库中 accounts集合数据
  AccountModel.find()
    .sort({ time: -1 }) // 按照添加时间降序排列
    .then((data) => {
      // 成功获取数据，将数据返回给客户端
      res.json({
        // 响应编号
        code: "0000", // 成功
        // 响应信息
        msg: "读取成功",
        // 响应的数据
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        // 获取数据失败处理
        code: "1001",
        msg: "数据读取失败",
        data: null,
      });
    });
});

// 新增记录接口
router.post("/account", checkTokenMiddleware, (req, res) => {
  // 表单验证，返回不同的错误信息
  console.log(req.body); // 获取请求体的数据
  // req.body 以对象形式获取到表单的数据，name为键名，value为值
  // 2024-02-10 => moment => new Date
  // 插入到 mongodb 数据库
  AccountModel.create({
    ...req.body, // ES6 解构
    // 修改time属性的值
    time: moment(req.body.time).toDate(),
  })
    .then((data) => {
      res.json({
        code: "0000",
        msg: "添加成功",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        code: "1002",
        msg: "添加失败",
        data: "null",
      });
    });
});

// 删除记录接口
router.delete("/account/delete", checkTokenMiddleware, (req, res) => {
  // 获取传递来的 id  /account/delete?id=xxx
  let id = req.query.id;
  // 删除mongodb中的数据
  AccountModel.deleteOne({ _id: id })
    .then((date) => {
      res.json({
        code: "0000",
        msg: "删除成功",
        data: date,
      });
    })
    .catch((err) => {
      res.json({
        code: "1003",
        msg: "删除失败",
        data: null,
      });
    });
});

// 获取单个账单接口
router.get("/account/:id", checkTokenMiddleware, (req, res) => {
  // 获取 id参数
  let { id } = req.params; // 对req.params对象进行结构
  // 查询数据库
  AccountModel.findById(id)
    .then((data) => {
      res.json({
        code: "0000",
        msg: "获取成功",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        code: "1004",
        msg: "获取失败",
        data: null,
      });
    });
});

// 更新账单接口
router.patch("/account/:id", checkTokenMiddleware, (req, res) => {
  // 获取要更新账单的 id 值
  let { id } = req.params;
  // 更新数据库     将要更新的数据放在请求体中
  AccountModel.updateOne({ _id: id }, req.body)
    .then((data) => {
      // 获取更新后的数据
      AccountModel.findById(id).then((data) => {
        res.json({
          code: "0000",
          msg: "更新成功",
          data: data,
        });
      });
    })
    .catch((err) => {
      res.json({
        code: "1005",
        msg: "更新失败",
        data: null,
      });
    });
});

module.exports = router;
