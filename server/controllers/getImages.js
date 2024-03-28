const getImages = (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "please provide the images and a style",
    });
  }
  try {
    images = req.body.images;
    style = req.body.style;
    image_data = [];
    images.array.forEach((image) => {
      image_data.push({
        image_url: image.data_url,
      });
    });
    res.status(200).json({ message: "recieved images" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getImages };
