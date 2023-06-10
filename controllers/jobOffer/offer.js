const CompanyModel = require("../../models/company.model");
const offerModel = require("../../models/jobOffer");
const company=require('../../models/company.model')

class offer {
  static sendOffer = async (req, res) => {
    try {
      const jobOffer = new offerModel(req.body);
      jobOffer.companyId = req.user._id;
      jobOffer.save();
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
        .populate({ path: "companyId", select: "_id , name  "})
        .populate({ path: "jobId", select: "title"})
              ;
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
    offerModel
      .findOneAndUpdate(
        { userId: req.params.id },
        {
          $set: {
            offeracceptanc: req.body.offeracceptanc,
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
        _id:req.params.id
      });
      res.status(201).json(deletedOffer);
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
}
module.exports = offer;
