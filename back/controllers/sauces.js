const Sauces = require('../models/sauces')
const fs = require('fs')

exports.createSauce = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauce);
    delete saucesObject._id;
    delete saucesObject._userId;
    const sauce = new Sauces({
      ...saucesObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0, 
      dislikes: 0, 
      usersDisliked: [], 
      usersLiked: [],  
    });
    console.log(sauce);
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée!'}))
      .catch(error => res.status(400).json({error}));
}; 

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?  {
    ...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body};

  delete sauceObject._userId;
  Sauces.findOne({_id: req.params.id})
    .then((sauce) =>{
      if(sauce.userId != req.auth.userId) {
        res.status(401).json({ message : 'Not authorized'})
      }else{
        Sauces.updateOne({_id: req.params.id}, {
          ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce modifié'}))
            .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
}; 

exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauces.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};


exports.getOneSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id})
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json({ error }));
  // next(); 
}; 

exports.getAllSauce = (req, res, next) => {
  Sauces.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
  // next(); 
}; 

exports.modifyLike = (req, res, next) => {
  const like = req.body.like;
  // Pour aimer une sauce
  if(like === 1){
    Sauces.updateOne({_id: req.params.id}, { $inc : { likes: 1 }, $push: { usersLiked: req.body.userId}, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Vous aimez cette sauce'}))
    .catch(error => res.status(400).json({ error }));
  // Pour ne pas aimer une sauce 
  }else if(like === -1){
    Sauces.updateOne({_id: req.params.id}, { $inc : { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id})
    .then(() => res.status(200).json({ message:"Vous n'aimez pas cette sauce"}))
    .catch(error => res.status(400).json({ error }));
  } else{
    Sauces.findOne({_id: req.params.id})
      .then(sauce => {
        if(sauce.usersLiked.indexOf(req.body.userId)!== -1){
          Sauces.updateOne({_id: req.params.id}, { $inc : {likes: -1}, $push: {usersLiked: req.body.userId}, _id: req.params.id})
          .then(() => res.status(200).json({ message: "Vous n'aimez plus cette sauce"}))
          .catch(error => res.status(400).json({ error }));
        }else if(sauce.usersDisliked.indexOf(req.body.userId)!== -1){
          Sauces.updateOne({_id: req.params.id}, { $inc : {dislikes: -1}, $push: {usersDisliked: req.body.userId}, _id: req.params.id})
          .then(() => res.status(200).json({ message:"Vous aimez maintenant cette sauce"}))
          .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(400).json({ error }))
  }
}; 

