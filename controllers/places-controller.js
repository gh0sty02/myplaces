const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const getCoordinates = require("../getCordinates");
const Place = require("../models/placeModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const getPlaceByPlaceId = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Couldn't find a place by that id", 500);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Cannot get places with that user id", 404);
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find place for the provided user id", 404)
    );
  }

  return res.json({
    places: places.map((p) => p.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const { title, description, creator, address } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs, Please Check Data", 422);
  }

  const coordinates = getCoordinates();

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    creator,
    image: req.file.path,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Could not find user with that id, please try again",
      404
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find user with that id, please try again",
      404
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not create User, Please Try again", 500);
    return next(error);
  }

  res.status(201).json({
    place: createdPlace,
  });
};

const updatePlaceById = async (req, res, next) => {
  const { title, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid Inputs, Please Check Data", 422));
  }
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not authorized", 401);
    return next(error);
  }
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place",
      401
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  const imagePath = place.image;
  console.log(imagePath);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
