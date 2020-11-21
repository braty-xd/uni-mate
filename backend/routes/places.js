const express = require("express");
const multer = require("multer");

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
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const place = new Place({
      //photo: req.body.photo,
      title: req.body.title,
      description: req.body.description,
      imagePath: url + "/images/" + req.file.filename,
      owner: req.userData.userId,
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
  const placeQuery = Place.find();
  let fetchedPlaces;
  if (pageSize && currentPage) {
    placeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  placeQuery
    .then((documents) => {
      fetchedPlaces = documents;
      return Place.countDocuments();
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
  Place.deleteOne({ owner: req.params.id }).then((result) => {
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  });
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    let placeId;
    if (req.file) {
      console.log("girdim");
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const place = {
      //_id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      imagePath: imagePath,
    };
    Place.findOne({ owner: req.userData.userId }).then((resultt) => {
      placeId = resultt._id;
      Place.updateOne({ _id: placeId, owner: req.userData.userId }, place)
        .then((result) => {
          if (result.nModified > 0) {
            res.status(200).json({ message: "Update successful!" });
          } else {
            res.status(401).json({ message: "Update failed!" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
);

module.exports = router;