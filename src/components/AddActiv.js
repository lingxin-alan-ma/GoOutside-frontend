import { useState } from "react";
import ActivDataService from "../services/activs";
import { useNavigate, useParams} from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

const AddActiv = ({ user }) => {
  const navigate = useNavigate();
  let params = useParams();

  const [name, setName] = useState();
  const [address, setAddress] = useState([]);
  const [description, setDescription] = useState();
  const [images, setImages] = useState();
  const [tags, setTags] = useState([]);

  const saveActiv = () => {
    var data = {
      user_id: user.googleId,
      name: name,
      address: address,
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

    </Container>
  )
}