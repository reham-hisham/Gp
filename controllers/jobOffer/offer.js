const { default: mongoose } = require("mongoose");
const CompanyModel = require("../../models/company.model");
const offerModel = require("../../models/jobOffer");
class offer {
  static sendOffer = async (req, res) => {
    try {
      const jobOffer = await new offerModel(req.body);
      jobOffer.companyId = req.user._id;
      await jobOffer.save();
      res.send({
        apiStatus: "success",
        data: jobOffer,
        message: "New offer is sent",
      });
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  static recieveOffers = async (req, res) => {
    try {
      const offers = await offerModel
        .find({ userId: req.user._id })
        .populate({ path: "companyId", select: { _id: 1, name: 1, image: 1 } });
      res.send({
        apiStatus: "success",
        data: offers,
        message: "New offer is sent",
      });
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  static setOfferState = (req, res) => {
    console.log(req.body);
    offerModel
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            offerAcceptance: req.body.offeracceptanc,
            comment: req.body.comment,
          },
        }
      )
      .then((doc) => {
        if (doc)
          return res.status(201).json({
            apiStatus: "Success",
            data: doc,
            message: "The offer is modified",
          });
        else
          res.status(200).json({
            apiStatus: "Fail",
            Message: "NO OFFER IS FOUND",
          });
      })
      .catch((e) => {
        res.status(400).send({
          apiStatus: false,
          message: e.message,
        });
      });
  };
  static deleteOffer = async (req, res) => {
    try {
      const deletedOffer = await offerModel.deleteOne({
        userId: req.body.userId,
        companyId: req.user._id,
        jobId: req.body.jobId,
        offerType: req.body.offerType,
      });
      res.status(201).json(deletedOffer);
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  static viewMyJobOffers = async (req, res) => {
    try {
      let myOffers;
      myOffers = await offerModel.find({ companyId: req.user._id });

      res.send(myOffers);
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
}
module.exports = offer;
