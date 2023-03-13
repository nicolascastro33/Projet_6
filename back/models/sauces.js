const mongoose = require('mongoose'); 

const saucesSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    heat: { type: Number, required: true }, 
    imageUrl:  { type: String, required: true },
    userId: { type: String },
    likes: { type: Number}, 
    dislikes: { type: Number}, 
    usersDisliked: {type: Array}, 
    usersLiked: {type: Array},  
})

module.exports = mongoose.model('Sauces', saucesSchema)