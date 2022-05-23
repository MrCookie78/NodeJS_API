const { Tache } = require("./mongo.js");

const t1 = new Tache({
	description : "Premiere tache",
	faite : false
});

t1.save();

const t2 = new Tache({
	description : "Deuxieme tache",
	faite : true
})

t2.save();

