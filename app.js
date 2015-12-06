var express = require('express')
  , morgan = require('morgan')
  , fs = require('fs')
  , path = require('path')
    ,request=require('request')
    ,async = require("async")
    ,FormData = require('form-data')
  , multipart = require('connect-multiparty');

var multiparty2 = require('multiparty');
var util = require('util');

var app = express();
app.use(express.static('./public'));
app.use(morgan('dev'));

app.listen(process.env.PORT || 3001);
console.log('Upload File running at: http://127.0.0.1:3001');


app.get('/upload', function(req, res) {
  res.end();
});


app.post('/upload', function(req, res) {

  //生成multiparty对象，并配置下载目标路径
  var form2 = new multiparty2.Form({uploadDir: './public/i3/'});
  var inputFile;
  //下载后处理
  form2.parse(req, function (err, fields, files) {
    var filesTmp = JSON.stringify(files, null, 2);

    if (err) {
      console.log('parse error: ' + err);
    } else {
      console.log('parse files: ' + filesTmp);
      inputFile = files.file[0];
      var uploadedPath = inputFile.path;
      console.log(uploadedPath);


      var form = new FormData();
      form.append("filename", fs.createReadStream(inputFile.path));//
      form.getLength(function (err, length) {
        if (err) {
          return requestCallback(err);
        }
        console.log(length);
        var url = "http://183.61.86.46:3000/upload";
        console.log(url);
        var r = request.post(url, requestCallback);
        r._form = form;
        r.setHeader('content-length', length);
        var boundaryKey = Math.random().toString(16);
        r.setHeader('Content-Type', 'multipart/form-data; \r\n boundary=----' + boundaryKey+'\r\n' );

      });

      function requestCallback(err, res, body) {
        console.log(4444);
        //console.log(res);
        console.log(5555);
        console.log(body);
		//console.log(inputFile.path);
         if (fs.existsSync(inputFile.path)) {
         fs.unlink(inputFile.path);//删除本地临时文件
         }
      }

      res.json(200);
    }
    //<script type='text/javascript'>window.parent.callbackMethod('{0}')</script>
    //res.writeHead(200, {'Content-Type': 'text/html'});
    //  res.end('<html><body><script type="text/javascript">window.parent.callbackMethod(' + data + ')</script></body></html>');

  });
});
