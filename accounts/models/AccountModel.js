// 导入 mongoose
const mongoose = require("mongoose");
// 创建文档的结构对象
let AccountSchema = new mongoose.Schema({
  title: {
    // 标题
    type: String,
    required: true,
  },
  time: Date, // 日期
  type: {
    // 类型
    type: Number,
    default: -1,
    enum: [1, -1],
  },
  account: {
    type: Number,
    required: true,
  }, // 金额
  remarks: String, //备注
});
// 创建模型对象  创建和使用 accounts 集合
let AccountModel = mongoose.model("accounts", AccountSchema);
// 暴露模型对象
module.exports = AccountModel;
