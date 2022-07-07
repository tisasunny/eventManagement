const router = require('express').Router();
const multer=require('multer');
const mongoose = require("./../db/mongoose");
const fs=require('fs');


var imgSchema = mongoose.Schema({
  img:{data:Buffer,contentType: String}
});

var image = mongoose.model("image",imgSchema);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const upload = multer({ storage: storage });
router.get(
    '/eventr',    async (req, res, next) => {
      try{
          res.render("eventr");
      }catch(err){
          next(err);
      }
    }
  );

  router.get(
    '/manage-event',    async (req, res, next) => {
      try{
          res.render("event_page");
      }catch(err){
          next(err);
      }
    }
  );
  router.get(
    '/manage-event/upload-bill',    async (req, res, next) => {
      try{
          res.render("upload_bill");
      }catch(err){
          next(err);
      }
    }
  );

  router.post("/manage-event/upload-bill/uploadphoto",upload.single('myImage'),(req,res)=>{
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        contentType:req.file.mimetype,
        image:new Buffer(encode_img,'base64')
    };
    image.create(final_img,function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log(result.img.Buffer);
            console.log("Saved To database");
            res.contentType(final_img.contentType);
            res.send(final_img.image);
        }
    })
  })
module.exports = router;