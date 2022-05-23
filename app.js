// Validation
const joi = require("joi");
const bcrypt = require("bcrypt");
const ObjectID = require("mongoose").Types.ObjectId;

// Express + async errors
const express = require("express");
require("express-async-errors"); // bcrypt est asynchrone
const app = express();

// JWT + dotenv + vérification de la présence d'une variable d'environnement
const jwt = require("jsonwebtoken");
require("dotenv").config();
if (!process.env.JWT_PRIVATE_KEY) {
  console.log(
    "Vous devez créer un fichier .env qui contient la variable JWT_PRIVATE_KEY"
  );
  process.exit(1);
}

// Base de données
const {Tache} = require("./mongo");

// On va avoir besoin de parser le json entrant dans req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/taches", async (req, res) => {
	res.status(200).json(await Tache.find({}));
})

const verifyId = async (req, res, next) => {
  const params = req.params;
  let id = params.id;

  // Vérification
  if (ObjectID.isValid(id)) {
    const user = await Tache.findById(id);

    if (user) next();
    else res.status(404).json({ error: "L'id n'existe pas." });
  }

  // Sinon
  else {
    res.status(404).json({ error: "L'id n'existe pas." });
  }
};

app.get("/tache/:id", [verifyId], async (req, res) => {
  const tache = await Tache.findById(req.params.id);
  res.status(200).json(tache);
});

app.use((err, req, res, next) => {
	res.status(500).json({erreur: err.message})
})


module.exports = app;