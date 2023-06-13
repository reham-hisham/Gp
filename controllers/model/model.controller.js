const followModel = require("../../models/followCompanies");
const jobPostModel = require("../../models/jopPost.model");
const { options } = require("../../routes/user.Route");
const userModel = require("../../models/users.model");
const { ObjectId } = require('mongodb');

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
const axios = require("axios");

class posts {
  static sendJobandCVtoModel = async (post, cvs, res) => {
    try {
      let data = await axios({
        method: "post",
        url: "http://localhost:8000/example",

        data: {
          description: post.description,
          skillsMustHave: post.skillsMustHave,
          users: cvs,
        },

        headers: { "Content-Type": "application/json" },
      });
      console.log("dattttttaaaaa", data.data);
      let finalcvs = await axios({
        method: "post",
        url: "http://127.0.0.1:8888/testing",

        data: { skills: data.data[0], users:cvs  , model :data.data[1]},

        headers: { "Content-Type": "application/json" },
      });
   
      for (let index in finalcvs.data.Resume) {
        console.log(finalcvs.data["Match confidence"][index] * 100);
        const user = await userModel
          .findOne({ _id: new ObjectId (finalcvs.data.Resume[index].split(".pdf")[0]) })
          .select("name email cv");

        post.matchedUsers.push({
          userId: user._id,
          rank: finalcvs.data["Match confidence"][index] * 100,
        });
      }
      await post.save()
      const p = await jobPostModel
        .findOne({ _id: post._id })
        .populate({ path: "matchedUsers.userId", select: "name email cv" });

      res.send({
        post: p,
      });
    } catch (err) {
      res.status(400).send({
        apiStatus: false,
        message: err.message,
      });
    }
  };

  static calculateAge = async (birthdate) => {
    const now = new Date();
    const birth = new Date(birthdate);
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };
  static getCvs = async (jobPost, res) => {
    try {
      let cvs;
      if ((jobPost.workingType = "Remote")) {
        cvs = await userModel
          .find({ jobType: jobPost.jobType, industry: jobPost.industry })
          .select("_id cv languages birthdate public_id");
      } else {
        cvs = await userModel
          .find({
            country: jobPost.Country,
            city: jobPost.City,
            jobType: jobPost.jobType,
            industry: jobPost.industry,
          })
          .select("_id cv languages birthdate public_id");
      }
      if (jobPost.maxAge) {
        cvs = cvs.filter(async (e) => {
          (await this.calculateAge(e.birthdate)) <= jobPost.maxAge;
        });
        cvs = cvs.filter((e) => e.cv != null);
        console.log(cvs);
      }

      await this.sendJobandCVtoModel(jobPost, cvs, res);
      //await this.sendJobandCVtoModel(jobPost , cvs)
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
}
module.exports = posts;
