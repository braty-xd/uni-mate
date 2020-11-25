const express = require("express");
const multer = require("multer");
const fs = require("fs");

const checkAuth = require("../middleware/check-auth");
const Place = require("../models/place");
const User = require("../models/user");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file.mimetype);
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

const router = express.Router();

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).array("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");

    let images = [];
    for (const fls of req.files) {
      const newUrl = url + "/images/" + fls.filename;
      images.push(newUrl);
    }

    const place = new Place({
      title: req.body.title,
      description: req.body.description,
      //imagePath: url + "/images/" + req.file.filename,
      imagePath: images,
      owner: req.userData.userId,
      city: req.body.city,
      university: req.body.uni,
      rent: +req.body.rent,
      ownerSex: req.body.ownerSex,
    });
    place.save().then((createdPlace) => {
      User.updateOne({ _id: createdPlace.owner }, { hasPlace: true }).then(
        (result) => {
          res.status(201).json({
            message: "Post added successfully",
            //placeId: createdPlace._id,
            place: {
              id: createdPlace._id,
              title: createdPlace.title,
              photo: createdPlace.photo,
              description: createdPlace.description,
              imagePath: createdPlace.imagePath,
            },
          });
        }
      );
    });
  }
);

router.get("", checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let queryObj = { city: req.query.usercity };
  if (req.query.uni) {
    queryObj.university = req.query.uni;
  }
  if (req.query.sex) {
    queryObj.ownerSex = req.query.sex;
  }
  if (req.query.maxrent) {
    queryObj.rent = { $lte: +req.query.maxrent };
  }
  //const placeQuery = Place.find({ city: req.query.usercity });
  const placeQuery = Place.find(queryObj);
  let fetchedPlaces;
  if (pageSize && currentPage) {
    placeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  placeQuery
    .then((documents) => {
      fetchedPlaces = documents;
      return Place.countDocuments({ city: req.query.usercity });
      // res.status(200).json({
      //   message: "Posts fetched successfully!",
      //   places: documents,
      // });
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        places: fetchedPlaces,
        maxPlaces: count,
      });
    });
});

router.get("/:id", checkAuth, (req, res, next) => {
  //Place.findById(req.params.id).then((place) => {
  Place.findOne({ owner: req.params.id }).then((place) => {
    if (place) {
      res.status(200).json(place);
    } else {
      res.status(404).json({ message: "Place not found!" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  //Could also delete pics but not doing it for now!!!!!!!!!
  Place.deleteOne({ owner: req.params.id }).then((result) => {
    if (result.n > 0) {
      console.log(result);
      // for (const img of resultt.imagePath) {
      //   let toDelete =
      //     __dirname.slice(0, __dirname.length - 7) +
      //     "/images" +
      //     img.slice(img.indexOf("images") + 6, img.length);
      //   fs.unlinkSync(toDelete);
      // }
      res.status(200).json({ message: "Deletion successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  });
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).array("image"),
  (req, res, next) => {
    if (!req.files) {
      if (req.body.ownerSex) {
        Place.updateOne({ _id: req.params.id }, { ownerSex: req.body.ownerSex })
          .then((plc) => {
            if (plc.n > 0) {
              res.status(200).json({ message: "Update successful!" });
            } else {
              res.status(401).json({ message: "Update faileaaaaaad!" });
            }
          })
          .catch((err) => {
            console.log("errrr");
            console.log(err);
          });
      }
      if (req.body.university) {
        console.log("selamin helo");
        console.log(req.params.id);
        Place.updateOne(
          { _id: req.params.id },
          { university: req.body.university }
        )
          .then((plc) => {
            console.log(";)");
            console.log(plc);
            if (plc.n > 0) {
              console.log(";)");
              res.status(200).json({ message: "Update successful!" });
            } else {
              res.status(401).json({ message: "Update faileaaaaqweqweqaad!" });
            }
          })
          .catch((err) => {
            console.log("errrr");
            console.log(err);
          });
      }
    }
    if (!req.files) {
      return;
    }
    //let imagePath = req.body.imagePath;
    let placeId;
    //let images = req.body.imagePath;
    let images = [];
    console.log("putta");
    //console.log(images);
    if (req.files) {
      console.log("girdim");
      const url = req.protocol + "://" + req.get("host");
      //imagePath = url + "/images/" + req.file.filename;
      console.log(req.files);
      for (const fls of req.files) {
        const newUrl = url + "/images/" + fls.filename;
        images.push(newUrl);
      }
    }
    const place = {
      //_id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      imagePath: images,
      rent: +req.body.rent,
    };
    Place.findOne({ owner: req.userData.userId }).then((resultt) => {
      placeId = resultt._id;
      //fs.unlinkSync("./asd");
      console.log(__dirname);
      for (const img of resultt.imagePath) {
        let toDelete =
          __dirname.slice(0, __dirname.length - 7) +
          "/images" +
          img.slice(img.indexOf("images") + 6, img.length);
        fs.unlinkSync(toDelete);
      }
      Place.updateOne({ _id: placeId, owner: req.userData.userId }, place)
        .then((result) => {
          if (result.n > 0) {
            res.status(200).json({ message: "Update successful!" });
          } else {
            res.status(401).json({ message: "Update faileaaaaaad!" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
);

module.exports = router;
