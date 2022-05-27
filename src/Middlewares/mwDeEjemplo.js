function mwDeEjemplo (req, res, next) {
    console.log('pasaste por el MW');
    next();
}

module.exports = mwDeEjemplo;