/* 
  @param{*} success 数据库连接成功的回调
  @param{*} error 数据库连接失败的回调
*/
// 暴露一个函数
module.exports = function (success, error) {
  // 当未传递错误回调时，设置error的默认值
  if (typeof error !== "function") {
    error = () => {
      console.log("连接失败");
    };
  }

  // 导入mongoose
  const mongoose = require("mongoose");
  // 导入配置文件
  const { DBHOST, DBPORT, DBNAME } = require("../config/config");

  // 连接 mongodb 数据库
  mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

  // 设置回调
  // 设置连接成功的回调 once：事件回调函数只执行一次
  mongoose.connection.once("open", () => {
    success(); //连接成功的回调
  });

  // 设置连接失败的回调
  mongoose.connection.on("err", () => {
    error();
  });

  // 设置连接关闭的回调
  mongoose.connection.on("close", () => {
    console.log("连接关闭");
  });
};
