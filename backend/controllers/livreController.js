// controllers/bookController.js
const Livre = require('../models/livreModel');

const getAllLivre = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;  

    const skip = (page - 1) * limit;

    const livres = await Livre.find()
      .skip(skip) 
      .limit(limit);  

    const totalLivres = await Livre.countDocuments();

    const totalPages = Math.ceil(totalLivres / limit);

    res.json({
      livres,
      pagination: {
        totalPages,
        currentPage: page,
        totalLivres,
        limit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Erreur lors de la récupération des livres", error: err.message });
  }
};


const createLivre = async (req, res) => {
  const { titre, auteur, date_sortie, nb_page } = req.body;

  const newLivre = new Livre({
    titre,
    auteur,
    date_sortie,
    nb_page
  });

  try {
    const livre = await newLivre.save();
    res.status(201).json(livre);
  } catch (err) {
    res.status(400).send({ message: "Error saving book.", error: err });
  }
};

const getLivreById = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);
    if (!livre) {
      return res.status(404).send({ message: "Livre not found" });
    }
    res.json(livre);
  } catch (err) {
    res.status(500).send({ message: "Error fetching book.", error: err });
  }
};
const deleteLivre = async (req, res) => {
  try {
    const livre = await Livre.findByIdAndDelete(req.params.id);
    if (!livre) {
      return res.status(404).send({ message: "Livre not found" });
    }
    res.status(200).send({ message: "Livre deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error deleting book.", error: err });
  }
};

const updateLivre = async (req, res) => {
  const { titre, auteur, date_sortie, nb_page } = req.body;

  try {
    const livre = await Livre.findByIdAndUpdate(
      req.params.id,
      { titre, auteur, date_sortie, nb_page },
      { new: true } 
    
    );

    if (!livre) {
      return res.status(404).send({ message: "Livre not found" });
    }

    res.status(200).json(livre);
  } catch (err) {
    res.status(400).send({ message: "Error updating book.", error: err });
  }
};

const searchBookByName = async (req, res) => {
  const { titre } = req.query;

  try {
    const livre = await Livre.find({ titre: new RegExp(titre, 'i') }); 

    if (!livre) {
      return res.status(404).send({ message: "Livre non trouvé" });
    }

    res.json(
      livre,
    );
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Erreur lors de la recherche du livre", error: err.message });
  }
};

module.exports = {
  getAllLivre,
  createLivre,
  getLivreById,
  deleteLivre,
  updateLivre,
  searchBookByName
};
