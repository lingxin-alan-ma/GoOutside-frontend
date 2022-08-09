import { useState } from "react";
import ActivDataService from "../services/activs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";


import S3 from 'react-aws-s3';
import Upload from "./Upload";
// window.Buffer = window.Buffer || require("buffer").Buffer;

const AddActiv = ({ user }) => {
  const navigate = useNavigate();
  const params = useParams();
  const location=useLocation();

  let editing = false;
  let initialNameState = "";
  let initialAddressState = "";
  let initialDescriptionState = "";
  let initialImageUrlState = "";
  let initialTagState = "";

  

  console.log(location.state);
  console.log(params.id);
  if(location.state && location.state.currentActiv){
    editing = true;
    initialNameState = location.state.currentActiv.name;
    initialAddressState = location.state.currentActiv.address;
    initialDescriptionState = location.state.currentActiv.description;
    initialImageUrlState = location.state.currentActiv.images;
    initialTagState = location.state.currentActiv.tags;
  }
  
  
  const [name, setName] = useState(initialNameState);
  const [address, setAddress] = useState(initialAddressState);
  const [description, setDescription] = useState(initialDescriptionState);
  const [imageUrl, setImageUrl] = useState(initialImageUrlState);
  const [tag, setTag] = useState(initialTagState);
  
  console.log(tag);

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
      user_name: user.name,
      name: name,
      address: address,
      imageUrl: imageUrl,
      description: description,
      tag: tag
    }
    console.log(data);
    if (editing) {
      data.activ_id = location.state.currentActiv._id;
      ActivDataService.updateActiv(data)
        .then(response => {
          navigate("/activs/"+params.id);
        })
        .catch(e => {
          console.log(e);
        })
    }
    else {
      ActivDataService.creatActiv(data)
      .then(response => {
        console.log(params);
        //navigate("/activs/" + params.id)
      })
      .catch(e => {
        console.log(e);
      });
    }
  }

  return (
    <Container className="main-container">
      
      <Form className="form-horizontal">
        <Form.Group className="mb-3">
          <Form.Label>Name:</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter name"
            required
            name={ name }
            onChange={ onChangeName }
            defaultValue={ name }
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
            defaultValue={ address }
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
            defaultValue={ description }
            as="textarea" rows={3}
          ></Form.Control >
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tag:</Form.Label>
          <Form.Select 
            aria-label="Tag:" 
            onChange={onChangeTag}
            tag={ tag }
            defaultValue = {tag}
            >
            <option value="">chose tag</option>
            <option value="hiking">hiking</option>
            <option value="climbing">climbing</option>
            <option value="fishing">fishing</option>
            <option value="kayaking">kayaking</option>
            <option value="camping">camping</option>
            <option value="cycling">cycling</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <Upload setImageUrl={setImageUrl} ImageUrl={imageUrl}></Upload>
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