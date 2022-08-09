import React, { useState, useEffect, useCallback } from 'react';
import ActivDataService from "../services/activs";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { BsHeart, BsHeartFill } from "react-icons/bs";

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
  console.log("MyActive " + user);
  console.log(user);
  console.log(activs);
 
  const retrieveActivs = useCallback(() => { 
    ActivDataService.getActivsByUser(user.googleId)
      .then(response => {
        //console.log(response.data);
        setActivs(response.data);
        //console.log(activs);        
      })
      .catch(e => {
        console.log(e);
      });
  },);

  useEffect(() => {
    retrieveActivs();
  },[activs]);

 
  return (
    <div className="App">     
      <Container className="main-container">  
      <Button variant="light">  
      
        <Link  to={"/myactiv"} style={{ textDecoration:'none'}}>
        Upload new activities
                              
        </Link>  
        </Button>      
        <Row className="activRow">
          { activs.map((activ) => {
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
                          }} >
                            Edit
                          </Link>
                        </Col>
                        <Col>
                        <Button variant = "link" onClick = {()=>{
                        var data = {
                        activs_id: activ._id,
                        user_id: user.googleId,                    
                        }
                        console.log(data);
                        ActivDataService.deleteActivs(data)
                        .then(response=>{
                          console.log(activ);
                          console.log(activs);
                            setActivs((activs) => {
                              activs.splice(index, 1);
                              console.log(activs);
                               return ({
                                 ...activs
                               })                            
                              })
                            })   
                        .catch(e=>{
                          console.log(e);
                        })
                      }
                    }>Delete
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