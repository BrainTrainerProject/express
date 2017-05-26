
module.exports = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const authToken = req.headers.authorization.split(' ')[1];

    // Suche nach Profile in unserer Datenbank
    // TODO: Nur zum testen
    if (authToken !== 'das_ist_ein_geheimnis') {
      return next(new Error('Das Token stimmt nicht überein'));
    }
    return next();
  }

  return next(new Error('Authorization header is empty or does not have the format: "Bearer <token>"'));
};
