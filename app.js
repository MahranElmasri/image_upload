var express=require('express');
var ejs=require('ejs');
var multer=require('multer');
var path=require('path');

//set storage engine
const storage=multer.diskStorage({
	destination:'./public/upload/',
	filename:function(req,file, cb){
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});
//init Upload
const upload=multer({
		storage:storage,
		limits:{fileSize:1000000},
		fileFilter:function(req,file,cb){
			checkFileType(file,cb);
		}
	}).single('myImage');

//check file
function checkFileType(file,cb){
	//allow extenion
	const filetypes=/jpeg|jpg|png|gif/;
	//check ext
	const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype=filetypes.test(file.mimetype);
	if(mimetype&&extname){
		return cb(null,true);
	}else{
		if(req.file == undefined){
			res.render('index',{
				msg:'Error: No file Selected'
			});
		}else{
			res.render('index',{
				msg:'File Upload',
				file:`upload/${req.file.filename}`
			})
		}
	}

}

var app=express();

app.set('view engine','ejs');

app.use(express.static('./public'));

app.get('/', function(req,res){
	res.render('index');
});

app.post('/upload',(req,res)=>{
	upload(req,res,(err) => {
		if(err) {
			res.render('index',{
				msg: err
			});
		}else{
		if(req.file == undefined){
			res.render('index',{
				msg:'Error: No file Selected'
			});
		}else{
			res.render('index',{
				msg:'File Upload',
				file:`upload/${req.file.filename}`
			})
		}
	}
	});
});

app.listen(4000, function(){
	console.log('Server is running on port 4000');
});