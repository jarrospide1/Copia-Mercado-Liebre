const {check} = require('express-validator');

const createProductValidationMW = [
    check('name').notEmpty().withMessage('El nombre es obligatorio'),
    check('price').notEmpty().withMessage('El precio es obligatorio')
]

module.exports = createProductValidationMW;