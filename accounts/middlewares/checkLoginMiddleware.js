// 判断是否登录的路由中间件
module.exports = (req,res,next) => {
  if(!req.session.username){ // 获取不到该 sid 对应的session数据
    return res.redirect("/login") //跳转到登录页面
   }
   next();  // 执行后面的回调
}