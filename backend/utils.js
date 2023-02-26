import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isUser: user.isUser,
    },
    process.env.JWT_USER_SECRET,
    {
      expiresIn: "30d",
    }
  );
};


export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

    jwt.verify(token, process.env.JWT_USER_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {

        req.user = decode;
        
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

//---------------------EMPLOYEES---------------------------------

export const generateEmployeeToken = (employee) => {
  return jwt.sign(
    {
      _id: employee._id,
      firstname: employee.firstname,
      lastname: employee.lastname,
      email: employee.email,
      isEmployee: employee.isEmployee,
    },
    process.env.JWT_EMPLOYEE_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export const isAuthEmployee = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

    jwt.verify(token, process.env.JWT_EMPLOYEE_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.employee = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};


