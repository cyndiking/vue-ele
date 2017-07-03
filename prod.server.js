/**
 * Created by wangy on 2017-06-30.
 */
var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function (req, res ,next){
  req.url = 'index.html';
  next();
})

app.use(router);

var appData = require("./data.json");
var seller  = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();//路由
apiRoutes.get("/seller",function(req,res){
  res.json({
    errno:0,//error number 0这是正确的情况，这个数值根据不同的业务设置不同的数值
    data:seller
  });
});

apiRoutes.get("/goods",function(req,res){
  res.json({
    errno:0,//error number 0这是正确的情况，这个数值根据不同的业务设置不同的数值
    data:goods
  });
});

apiRoutes.get("/ratings",function(req,res){
  res.json({
    errno:0,//error number 0这是正确的情况，这个数值根据不同的业务设置不同的数值
    data:ratings
  });
});
app.use('/api',apiRoutes)//所有接口相关api的都需要api这个路由

app.use(express.static('./dist'));
/*
var server = app.listen(port)


var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
*/
  module.exports =  app.listen(port, function (err) {
    if (err) {
      console.log(err);
      return ;
    }
    console.log('listening at http://localhost:' + port + '\n');
  })
