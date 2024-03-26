import React from "react";
import ImageUploading from "react-images-uploading";
import "./ImageUploader.scss";
import closeIcon from "../../asset/close.svg";
import AnalyzeImages from "../AnalyzeImages/AnalyzeImages";
const ImageUploader = () => {
  const [images, setImages] = React.useState([]);
  const maxNumber = 10;

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  const onRemove = (index, event) => {
    event.stopPropagation(); // Prevent triggering the upload
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="image-uploader">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={10}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          dragProps,
        }) => (
          <div
            className="image-uploader__drop-area"
            {...dragProps}
            onClick={onImageUpload}
          >
            {imageList.length > 0 ? (
              <div className="image-uploader__preview">
                {imageList.map((image, index) => (
                  <div key={index} className="image-uploader__image-item">
                    <img
                      src={image["data_url"]}
                      alt=""
                      className="image-uploader__image"
                    />

                    <img
                      className="image-uploader__remove-btn"
                      src={closeIcon}
                      alt="close button"
                      onClick={(e) => onRemove(index, e)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="image-uploader__message">
                Drag & drop images here or click to select images
              </div>
            )}
            <div className="image-uploader__counter">
              {imageList.length} out of {maxNumber} images uploaded
            </div>
          </div>
        )}
      </ImageUploading>
      <AnalyzeImages />
    </div>
  );
};

export default ImageUploader;
