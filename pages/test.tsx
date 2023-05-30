import React, { useState, useEffect } from "react";
import save from "../src/services/s3/save";
import download from "../src/services/s3/download";

const UploadAndDisplayImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [upload, setUpload] = useState(false);

  const storeImage = (event : React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  }

  const removeImage = () => {
    setImage(null)
    setUpload(false)
  }

  const uploadImage = async () => {
    if (!upload && image) {
      let res = await save(image)
      console.log(res)
      setUpload(true)
    }
  }

  useEffect(() => {
    uploadImage()
    console.log(upload, image)
  }, [upload, image])

  return (
    <div>
      <h1>Upload and Display Image using React Hook's</h1>

      {image && (
        <div>
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(image)}
          />
          <br />
          <button onClick={removeImage}>Remove</button>
        </div>
      )}

      <br />
      <br />

      <input
        type="file"
        name="myImage"
        onChange={storeImage}
      />
    </div>
  );
};

export default UploadAndDisplayImage;