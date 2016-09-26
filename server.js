var express = require("express"),
    multer = require("multer"),
    port = process.env.PORT || 3000,
    path = require("path"),
    bodyParser = require("body-parser"),
    fs = require("fs");

var app = express();
var THREE_DAYS = 1000 * 60 * 60 * 24 * 3;
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(__dirname + '/app'));

app.get('/', function (req, res) {
    res.render('app/index.html');
});

app.get('/cropped/:file', function (req, res) {
    res.redirect('/uploads/' + req.params.file);
});

app.get('/main', function (req, res) {
    res.redirect('/');
});


app.post('/', function (req, res) {
    var storage = multer.diskStorage({
        destination: __dirname + '/app//uploads/',
        filename: function (req, file, cb) {
            cb(null, file.originalname /*file.originalname.replace(path.extname(file.originalname),'replaced') + '-' + Date.now() + path.extname(file.originalname)*/);
        }
    });
    var upload = multer({storage: storage});
    var upl = upload.single('image');
    upl(req, res, function (err) {

        res.end();
    });
});

app.post('/cropped/:file',function(req,res){
    var img = decodeBase64Image(req.body.img);
    var originalFile = __dirname + '/app/uploads/' + req.params.file;
    var croppedFile = __dirname + '/app/uploads/cropped-' + req.params.file;

    fs.writeFile(croppedFile, img.data, function (err) {
        setTimeout(function () {
            fs.unlinkSync(originalFile);
            fs.unlinkSync(croppedFile );
        }, THREE_DAYS);
        res.send(path.basename(croppedFile));
    });
});

app.get('/cropped/download/:file', function (req, res) {
    var file = req.params.file;
    var dest = path.join(__dirname,'/app/uploads/', file);
    res.download(dest);
});


function decodeBase64Image(dataString) {
 var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
 response = {};

 if (matches.length !== 3) {
 return new Error('Invalid input string');
 }

 response.type = matches[1];
 response.data = new Buffer(matches[2], 'base64');

 return response;
 }
app.listen(port);
console.log('Express server  running at http://localhost:' + port);