// 导入 lowdb
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
// 将数据存放到 db.json 文件中
const adapter = new FileSync("db.json");
// 获取 db 对象
const db = low(adapter);

// 初始化数据
db.defaults({ posts: [], user: {} }).write();

/* // 写入数据
db.get("posts") // 获取 posts 数组
  .push({ id: 1, title: "hello" }) // 向数组中添加数据
  .write(); // 写入数据

// 倒序插入数据
db.get("posts").unshift({ id: 2, title: "world" }).write();

// 获取指定数据
console.log(db.get("posts").find({ id: 2 }).value());

// 获取全部数据
console.log(db.get("posts").value()); //[ { id: 2, title: 'world' }, { id: 1, title: 'hello' } ]

// 删除指定数据
let res = db.get("posts").remove({ id: 1 }).write();
console.log(res); // res 为被删除的数据

// 更新数据
db.get("posts") // 获取 posts 数组
  .find({ id: 2 }) // 查找 id 为 2 的数据
  .assign({ title: "good" }) // 更新数据
  .write(); // 写入数据
 */

module.exports = db;