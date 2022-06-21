require("dotenv").config();
const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@nodejs.lwggm.mongodb.net/NodeJS_API`
  )
  .then(() => console.log("Connected to mongo"))
  .catch((err) => console.error("Failed to connect to mongo, ", err));


const tacheSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true,
	},
	faite: {
		type: Boolean,
		required: true,
	},
	crééePar: {
		type: String,
		required: true,
	}
});
const Tache = mongoose.model('Tache', tacheSchema);

const tacheUser = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
	},
	motdepasse: {
		type: String,
		required: true,
	}
});
const User = mongoose.model('User', tacheUser);

module.exports.createTache = async (obj) => {
  const tache = new Tache(obj);
  return tache.save();
};

module.exports.createUser = async (obj) => {
  const user = new User(obj);
  return user.save();
};

module.exports.Tache = Tache;
module.exports.User = User;
