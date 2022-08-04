import { useState } from "react";
import ActivDataService from "../services/activs";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";


import S3 from 'react-aws-s3';
import Upload from "./Upload";
// window.Buffer = window.Buffer || require("buffer").Buffer;

const AddActiv = ({ user }) => {
  const navigate = useNavigate();
  let params = useParams();

  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [description, setDescription] = useState();
  const [imageUrl, setImageUrl] = useState();

  const [tag, setTag] = useState();

  const onChangeName = e => {
    setName(e.target.value);
  }

  const onChangeAddress = e => {
    setAddress(e.target.value);
  }

  const onChangeDescription = e => {
    setDescription(e.target.value);
  }

  const onChangeTag = e => {
    setTag(e.target.value);
  }

  const saveActiv = () => {
    var data = {
      user_id: user.googleId,
      name: name,
      address: address,
      imageUrl: imageUrl,
      description: description,
      tag: tag
    }
    // ActivDataService.creatActiv(data)
    //   .then(response => {
    //     //navigate("/activs/" + params.id)
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
    console.log(data);
  }

  return (
    <Container className="main-container">
      
      <Form class="form-horizontal">
        <Form.Group className="mb-3">
          <Form.Label>Name:</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter name"
            required
            name={ name }
            onChange={ onChangeName }
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address:</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter address"
            required
            address={ address }
            onChange={ onChangeAddress }
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description:</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter description"
            required
            description={ description }
            onChange={ onChangeDescription }
            as="textarea" rows={3}
          ></Form.Control >
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tag:</Form.Label>
          <Form.Select 
            aria-label="Tag:" 
            onChange={onChangeTag}
            tag={ tag }
            >
            <option value="hiking">hiking</option>
            <option value="climbing">climbing</option>
            <option value="fishing">fishing</option>
            <option value="kayaking">kayaking</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <Upload setImageUrl={setImageUrl}></Upload>
      <br></br>
      <br></br>
      <br></br>
      <Button variant="primary" onClick={saveActiv}>
        Submit
      </Button>

    </Container>
  )
}

export default AddActiv;