const handleJWTError = () => {
  const message = "invalid token please login again";
  return message;
};
const handleJWTExpired = () => {
  const message = "your session has expired. Please login again";
  return message;
};
const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}.`;
  return message;
};

const handleDuplicateFieldsDB = (err) => {
  const keyObj = err.keyValue;
  const message = `${Object.keys(keyObj)} is already in use`;
  return message;
};

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  // to loop through errors.
  // object.values() runs the givin array
  // .map can only be used on arrays and takes only functions to give
  // back a new array with what the function does
  const message = `${errors.join(". ")}`;
  //console.log(message)

  //return appError(message, 400);
  return message;
};

const prodErrors = (err, req, res) => {
  console.log(err)
  return res.status(404).json({ message: err });
};

const devErrors = (err, req, res) => {
  console.log(err)
  return res.status(500).send({ message: err.stack });
  
};

export const errorController = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    devErrors(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "ValidationError") error = handleValidatorErrorDB(err);

    if (err.name === "CastError") error = handleCastErrorDB(err);

    if (err.name === "JsonWebTokenError") error = handleJWTError();

    if (err.name === "TokenExpiredError") error = handleJWTExpired();

    if (err.code === 11000) error = handleDuplicateFieldsDB(err);

    prodErrors(error, req, res);
  }
};
