const formDataValidator = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  if (!req.body.style) {
    return res.status(400).send("No style is selected");
  }
  next();
};
module.exports = { formDataValidator };
