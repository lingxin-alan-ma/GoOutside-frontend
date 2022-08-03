import { useState } from "react";
import ActivDataService from "../services/activs";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";



import S3 from "react-aws-s3";


const AddActiv = ({ user }) => {
  const navigate = useNavigate();
  let params = useParams();

  const [name, setName] = useState();
  const [address, setAddress] = useState([]);
  const [description, setDescription] = useState();
  const [imagesUrl, setImagesUrl] = useState();
  const [imageFile, setImageFile] = useState();
  const [tags, setTags] = useState([]);


  const config = {
    bucketName: proces.env.REACT_APP_BUCKET_NAME,
    dirName: 'media', /* optional */
    region: proces.env.REACT_APP_REGION,
    accessKeyId: process.env.REACT_APP_ACCESS,
    secretAccessKey: process.env.REACT_APP_SECRET,
    s3Url: 'https:/your-custom-s3-url.com/', /* optional */
  }

  const ReactS3Client = new S3(config);
  /*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

  /* This is optional */
  const newFileName = 'test-file';


  const handleFileInput = (e) => {
    setImageFile(e.target.files[0]);
  }


  const uploadPic = async (imageFile) => {
    ReactS3Client
      .uploadFile(imageFile, newFileName)
      .then(data => {
        console.log(data);
        setImagesUrl(data.Location);
      })
      .catch(err => console.error(err));
  }





  const saveActiv = () => {
    var data = {
      user_id: user.googleId,
      name: name,
      address: address,
      imagesUrl: imagesUrl,
      description: description,
      tags: tags
    }
    ActivDataService.creatActiv(data)
      .then(response => {
        navigate("/movies/" + params.id)
      })
      .catch(e => {
        console.log(e);
      });
  }

  return (
    <Container className="main-container">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>{"Create"} activity</Form.Label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
          />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            label="Address"
          />
          <input
            type="file"
            onChange={handleFileInput}
          />
          <button onClick={() => {uploadFile(imageFile)}}>Upload</button>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Description"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            label="Tags"
          />
        </Form.Group>
      </Form>

      

      <Button variant="primary" onClick={saveActiv}>
        Submit
      </Button>
    </Container>
  )
}