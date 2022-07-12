const express = require('express');
const app = express();
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(req.headers.format)}`)
    }
})

const upload = multer({
    storage: storage
})
app.use('/profile', express.static(
    'upload/images'));

app.post("/upload", upload.array('images', 10), (req, res) => {
    console.log("fileDetails---->", req.files);
    res.json({
        success: 1,
        profile_url: `http://localhost:4001/profile/${req.files[0].filename}`
    })
})

app.post("/edit", upload.single('images'), async (req, res) => {
    await sharp(req.file).toFormat(req.body.format)
    console.log("fileDetails---->", req.file);


    res.json({
        success: 1,
        profile_url: `http://localhost:4001/profile/${req.file.filename}`
    })
})

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}
app.use(errHandler);
app.listen(4001, () => {
    console.log("server up and running");
})