const express = require('express');
const auth = require('../middleware/auth')
const router = express.Router();
const multer = require('../middleware/multer-config')


const saucesCtrl = require('../controllers/sauces')

router.post('/sauces', auth, multer, saucesCtrl.createSauce);
router.get('/sauces', auth, saucesCtrl.getAllSauce);
router.get('/sauces/:id', auth, saucesCtrl.getOneSauce);
router.delete('/sauces/:id', auth, saucesCtrl.deleteSauce);
router.put('/sauces/:id', auth, multer, saucesCtrl.modifySauce);
router.post('/sauces/:id/like', auth, saucesCtrl.modifyLike)


module.exports = router;