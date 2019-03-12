const express = require('express')
const compression = require('compression')
const apiRoutes = require('./server/routes')


var app = express()
var port = 8000
// app.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); 
//   res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   next();
// });


app.use('/api', apiRoutes)

app.use(compression())

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log(`Listening on ${port} port`);
})