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
const {createTache, Tache} = require("./mongo");

// On va avoir besoin de parser le json entrant dans req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de vérification d'id
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


// Route retournant toutes les taches
app.get("/taches", async (req, res) => {
	res.status(200).json(await Tache.find({}));
})

// Route retournant une tache par ID
app.get("/tache/:id", [verifyId], async (req, res) => {
  const tache = await Tache.findById(req.params.id);
  res.status(200).json(tache);
});

// Route permettant d'ajouter une tache
app.post("/tache", async (req, res) => {
  const payload = req.body;

  // validation
  const schema = joi.object({
    description: joi.string().required(),
		faite: joi.bool().required()
  });
  const { value, error } = schema.validate(payload);

  // Erreur => Renvoie erreur
  if (error) res.status(400).json({ erreur: error.details[0].message });
  else {
    // Ajout valeur dans base de données
    const tache = await createTache(value);

    // Renvoie objet créé
    res.status(201).json(tache);
  }
});


// Route permettant de modifier une tache
app.put("/tache/:id", [verifyId], async (req, res) => {
  const id = req.params.id;
  const payload = req.body;

  // validation
  const schema = joi.object({
    description: joi.string(),
		faite: joi.bool(),
  });
  const { value, error } = schema.validate(payload);

  if (error) res.status(400).json({ error: error.details[0].message });
  else {
    // Modification
    await Tache.findByIdAndUpdate(id, value);
		const tache = await Tache.findById(id);
    res.status(200).json(tache);
  }
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
	res.status(500).json({erreur: err.message})
})


module.exports = app;