const router = require("express").Router();
const mongoose = require("./../db/mongoose");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const Image = require("../models/image.model.js");
const Task = require("../models/task.model.js");

router.get('/dashboard',async(req,res,next) => {
  try {
    res.render("dashboard");
  } catch (error) {
    next(error);
  }
})

// report generation code
router.get("/generate-report", async (req, res, next) => {
  try {
    let list = "";
    const docs = await Image.find({ email: `${req.user.email}` });
    console.log(docs);
    if(docs.length == 0){
      throw new Error("You have not uploaded any images to generate report")
    }
    docs.forEach((doc) => {
      list = list + " " + doc.imagePath;
    });
    list = list.trim();
    console.log(list);
    let outputFilePath = Date.now() + "-report.pdf";
    exec(`magick convert ${list} ${outputFilePath}`, (err, stderr, stdout) => {
      if (err) throw err;
      res.download(outputFilePath, (err) => {
        if (err) throw err;
        fs.unlinkSync(outputFilePath);
      });
    });
  } catch (error) {
    console.log(error);
    res.send(error + ` : Error uploading file <a href="/user/dashboard">Go back home</a> `);
  }
});

// image upload code
router.post("/manage-event/upload-bill", async (req, res, next) => {
  try {
    const file = req.files.mFile;
    if (file.truncated) {
      throw new Error("File size is too big...");
    }
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      const fileName = new Date().getTime().toString() + path.extname(file.name);
      const savePath = path.join(__dirname, "../public", "uploads", fileName);
      const relativePath = path.join("public", "uploads", fileName);
      await file.mv(savePath);
      let obj = {};
      obj["username"] = req.user.username;
      obj["email"] = req.user.email;
      obj["imagePath"] = relativePath;
      const image = new Image(obj);
      image.save();
    }
    else{
      throw new Error("Only jpg and png is allowed");
    }
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send(error + " : Error uploading file");
  }
});

router.post("/manage-event/add-task", async (req, res, next) => {
  console.log(req.body['taskName']);
  console.log("User : "+req.user.email);

  
  const task=new Task({email:req.user.email,taskName:req.body['taskName'],budget:'0',subcoordinator:''});
  task.save();
  res.redirect("/user/manage-event");
});

router.get("/eventr", async (req, res, next) => {
  try {
    res.render("eventr");
  } catch (err) {
    next(err);
  }
});

router.get("/manage-event", async (req, res, next) => {
  try {
    const tasksData=await Task.find({email:req.user.email});

    res.render("event_page",{tasks:tasksData});
  } catch (err) {
    next(err);
  }
});

router.get("/manage-event/upload-bill", async (req, res, next) => {
  try {
    res.render("upload_bill");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
