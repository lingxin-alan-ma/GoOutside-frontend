import React, { useState, useEffect, useCallback } from 'react';
import ActivDataService from "../services/activs";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { BsPencil, BsPenFill, BsTrash } from "react-icons/bs";
import { BsPlusLg } from "react-icons/bs";

import "react-slideshow-image/dist/styles.css";
import "./ActivsList.css";

const noImageAvailable = "../images/NoImageAvailable_james-wheeler-ZOA-cqKuJAA-unsplash.jpg";

const MyActivs = ({
  user,
  favorites,
  addFavorite,
  deleteFavorite
}) => {
  // useState to set state values
  const [activs, setActivs] = useState([]);
 
  const retrieveActivs = useCallback(() => { 
    ActivDataService.getActivsByUser(user.googleId)
      .then(response => {
        setActivs(response.data);        
      })
      .catch(e => {
        console.log(e);
      });
  },[activs]);

  const deleteActiv = (activ, index) => {
    var data = {
      activ_id: activ._id,
      user_id: user.googleId,                    
      }
      console.log(data);
      ActivDataService.deleteActivs(data)
      .then(response=>{
          setActivs((activs) => {
            activs.splice(index, 1)                          
            })
          })   
      .catch(e=>{
        console.log(e);
      })

  }

  useEffect(() => {
    retrieveActivs();
  },[activs]);

  return (
    <div className="App">     
      <Container className="main-container">  
        <Link  to={"/myactiv"} style={{ textDecoration:'none'}}>
          <Button variant="light"> 
            <BsPlusLg style={{ marginRight: "10", marginBottom: "3"}}/> 
            Upload new activities 
          </Button>                       
        </Link>  
        <Row className="activRow">
          { activs == null ? alert("You are deleting your activity!") : activs.filter(activ => !activ.hide).map((activ, index) => {           
            return (              
              <Col key={activ._id}>
                <Card className="activsListCard">
                  { user && (
                      favorites.includes(activ._id) ?
                      <BsHeartFill className="heart heartFill" onClick={() => {
                        deleteFavorite(activ._id);
                      }}/>
                      :
                      <BsHeart className="heart heartEmpty" onClick={() => {
                        addFavorite(activ._id);
                      }}/>
                  ) }
                  <Link to={"/activs/"+activ._id}>
                    <Card.Img 
                      className="smallPoster" 
                      src={activ.images[0]}
                      alt={"poster not available"}
                      onError={event => {
                        event.target.src = noImageAvailable
                        event.onerror = null
                      }}
                      />
                  </Link>
                  <Card.Body className="activCardBody">
                    <Card.Title> {activ.name}</Card.Title>
                    <Card.Text className="activTags" style={{color: "blue"}}>
                      {activ.tags}
                    </Card.Text>  
                    <Card.Text>
                      {activ.address[1]}
                    </Card.Text>
                    <Card.Text className="activDescription">
                      {activ.description}
                    </Card.Text>
                    { user && user.googleId === activ.user_id &&
                      <Row>
                        <Col>                        
                        <Link to={{
                            pathname: "/myactiv"
                          }}
                          state = {{
                            currentActiv: activ
                          }} style={{ textDecoration:'none'}} >
                            <Button variant="secondary" >
                              Edit
                              <BsPencil style={{ marginLeft: "10", marginBottom: "3" }}/>
                            </Button>
                          </Link>  
                        </Col>
                        <Col>
                          <Button variant="danger" onClick = {()=>{
                            deleteFavorite(activ._id);
                            deleteActiv(activ, index);                          
                          }
                          }>
                            Delete
                          <BsTrash style={{ marginLeft: "10", marginBottom: "3"}}/>
                          </Button>
                        </Col>
                      </Row>
                    }
                  </Card.Body>  

                </Card>
              </Col>
            )
          })}
        </Row>
        <br />
  
      </Container>
    </div>
  )
}


export default MyActivs;