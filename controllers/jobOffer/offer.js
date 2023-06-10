const CompanyModel = require("../../models/company.model");
const offerModel = require('../../models/jobOffer')
class offer {
    static sendOffer = async (req, res) => {
        try {
            const jobOffer = new offerModel(req.body)
            jobOffer.companyId = req.user_id
            jobOffer.save()
            res.send({
                apiStatus: 'success',
                data: jobOffer,
                message: "New offer is sent",
            });
        }
        catch (e) {
            res.status(400).send({
                apiStatus: false,
                message: e.message,
            });
        }
    }
    static recieveOffers = async (req, res) => {
        try {
            const offers = await offerModel.find({ userId: req.user._id })
                .populate({ path: 'Company', select: { _id: 1, name: 1, image: 1 } })
            await offers.save()
            res.send({
                apiStatus: 'success',
                data: offers,
                message: "New offer is sent",
            });
        } catch (e) {
            res.status(400).send({
                apiStatus: false,
                message: e.message,
            });
        }

    }
    static setOfferState = (rqe, res) => {

        offerModel.findOneAndUpdate({ userId: req.user._id },
            { $set: { offeracceptanc: req.body.offeracceptanc, comment: req.body.comment } })
            .then((doc) => {
                if (doc)
                    return res.status(201).json({
                        apiStatus: 'Success',
                        data: doc,
                        message: "The offer is modified",
                    })
                else
                    res.status(200).json({
                        apiStatus: 'Fail',
                        Message: "NO OFFER IS FOUND",

                    })
            })
            .catch(
                (e) => {
                    res.status(400).send({
                        apiStatus: false,
                        message: e.message,
                    });
                }
            )
    }
    static deleteOffer = async (req, res) => {
        try {
            const deletedOffer = await offerModel.deleteOne({ userId: req.body.userId,
                 companyId: req.user._id,
                 jobId:req.body.jobId,
                offerType:req.body.offerType })
            res.status(201).json(deletedOffer)
        }
        catch (e) {
            res.status(400).send({
                apiStatus: false,
                message: e.message,
            });
        }
    }
}
module.exports = offer;