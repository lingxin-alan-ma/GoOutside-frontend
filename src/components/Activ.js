import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ActivDataService from '../services/activs';
import { Link, Navigate, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
// import { Slide } from 'react-slideshow-image';
import { BsHeart, BsHeartFill } from "react-icons/bs";
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import { Rating } from 'react-simple-star-rating'
import StarRatings from 'react-star-ratings';

// import Geocode from 'react-geocode';
// import { FacebookShareButton, TwitterShareButton } from "react-share";
// import { FacebookIcon, TwitterIcon } from "react-share";
// import FaFacebook from "react-icons/lib/fa/facebook";
// import { ShareButton } from "react-custom-share";

import "react-slideshow-image/dist/styles.css";
import "./Activ.css";

const noImageAvailable = "../images/NoImageAvailable_james-wheeler-ZOA-cqKuJAA-unsplash.jpg";

// const google = window.google;
// var geocoder = new google.maps.Geocoder();

// Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);

const API_KEY=process.env.REACT_APP_GOOGLE_API_KEY;

const Activ = ({ 
  user, 
  favorites,
  addFavorite,
  deleteFavorite
}) => {
  
  let editingRating = false;
  let params = useParams();

  // const [user, setUser] = useState(null);

  const [activ, setActiv] = useState({
    id: null,
    name: "",
    // tags: [],
    tags: "",
    reviews: [],
    images: [],
    coord: [],
  });

  useEffect(() => {
    const getActiv = id => {
      ActivDataService.getActivDetail(id)
        .then(response => {
          setActiv(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
    getActiv(params.id);
  }, [params.id]);

  const deleteReview = (reviewId, index) => {
    let data = {
      review_id: reviewId,
      user_id: user.googleId
    };
    ActivDataService.deleteReview(data)
      .then(response => {
        setActiv((prevState) => {
          prevState.reviews.splice(index, 1);
          return ({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  }

  // const getCoordinate = useCallback((address) => {
  //   Geocode.fromAddress(address).then(
  //     response => {
  //       const { lat, lng } = response.results[0].geometry.location;
  //       console.log(lat, lng);
  //       return `{ lat: ${lat}, lng: ${lng} }`
  //     },
  //     error => {
  //       console.error(error);
  //     },);
  // }, []);

  const getCenter = (coord) => {
    // console.log(coord);
    const center = { lat: 42.360, lng: -71.059};
    try {
      center.lat = coord[0];
      center.lng = coord[1];
    } catch (e) {
      console.error(e);
    }
    return center;
  }

  const [rating, setRating] = useState(0) 

  const handleRating = (rate) => {
    setRating(rate)
    // TODO
  }

  return (
    <div>
      <Container>
        <Row >
          <Col xs={12} sm={12} md={9} lg={6}>
            {/* <div className="poster">
              <Image
                className="bigPicture"
                src={activ.images[0]}
                // src={activ.images}
                alt={"images not available"}
                onError={event => {
                  event.target.src = noImageAvailable
                  event.onerror = null
                }}
                fluid />
            </div> */}
            <div>
              { user && (
                  favorites.includes(activ._id) ?
                  <BsHeartFill className="heart2 heartFill" onClick={() => {
                    deleteFavorite(activ._id);
                  }}/>
                  :
                  <BsHeart className="heart2 heartEmpty" onClick={() => {
                    addFavorite(activ._id);
                  }}/>
              ) }
              <AliceCarousel 
              autoPlay={true} 
              autoPlayInterval={5000}
              fadeOutAnimation={true}
              mouseTrackingEnabled={true}
              disableAutoPlayOnAction={true}
              items={activ.images.map((each, index) => (
                  <img 
                    src={each}
                    alt={"images not available"}
                    onError={event => {
                      event.target.src = noImageAvailable
                      event.onerror = null
                    }} />
                ))}
              />
            </div>
          
            <div className="map">
            <LoadScript
              // googleMapsApiKey = {API_KEY}
            >
              <GoogleMap
                mapContainerClassName="map-container"
                center={getCenter(activ.coord)}
                zoom={12}
              >
                <Marker position={getCenter(activ.coord)}/>
              </GoogleMap>
            </LoadScript>
            </div>
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5" style={{fontSize: '1.5em'}}>
                {activ.name}
                <div style={{display: 'flex'}}>
                  <StarRatings
                    rating={
                      activ.rating ? activ.rating[0] : 0
                    }
                    starDimension="1.5rem"
                    starSpacing=".1rem"
                    starRatedColor="orange"
                  />
                  <Card.Text style={{fontSize: '.75em', paddingTop: '.55em'}}>
                    {'('}
                    {activ.rating ? activ.rating[1] : 0}
                    {')'}
                  </Card.Text>
                </div>
              </Card.Header>
              <Card.Body>
                {user &&
                  <Rating onClick={handleRating} ratingValue={rating} 
                    /* Available Props */ 
                  />
                }
                <Card.Text style={{color: "blue"}}>
                  {activ.address}
                </Card.Text>
                <Card.Text>
                  {activ.description}
                </Card.Text>
                <Card.Text className="activTags" style={{color: "green", fontFamily: "Architects Daughter", fontSize: "1.2em", fontWeight: "600"}}>
                  {/* Tags: { activ.tags.map((tag, i) => {
                    return (
                      <option value={tag}
                      key={i}>
                        {tag}
                      </option>
                    )
                  })} */}
                  {activ.tags}
                  {/* {activ.coord} */}
                </Card.Text>  
                {/* <div>
                  <FacebookShareButton
                    url={"h"}
                    quote={""}
                    hashtag={"#hashtag"}
                    description={""}
                    className="Demo__some-network__share-button"
                  >
                    <FacebookIcon size={32} round /> Facebookでshare
                  </FacebookShareButton>
                  <br />
                  <TwitterShareButton
                    title={"test"}
                    url={""}
                    hashtags={["hashtag1", "hashtag2"]}
                  >
                    <TwitterIcon size={32} round />
                    Twitter share
                  </TwitterShareButton>
                </div> */}
                
                { user &&
                  <Link to={"/activs/" + params.id + "/review"}>
                    Add Review
                  </Link> }
              </Card.Body>
            </Card>
            <Card>
              <Card.Header as="h2">Reviews</Card.Header>
              <Card.Body>
                { activ.reviews.map((review, index) => {
                  return (
                    <div className="d-flex" key={review._id}>
                      <div className="flex-shrink-0 reviewsText">
                        <h5>{review.name + " reviewd on "} { moment(review.date).format("Do MMMM YYYY") }</h5>
                        <p className="review">{review.review}</p>
                        { user && user.googleId === review.user_id &&
                          <Row>
                            <Col>
                              <Link to={{
                                pathname: "/activs/"+params.id+"/review"
                              }}
                              state = {{
                                currentReview: review
                              }} >
                                Edit
                              </Link>
                            </Col>
                            <Col>
                              <Button variant="link" onClick={ () =>
                              {
                                deleteReview(review._id, index)
                              } }>
                                Delete
                              </Button>
                            </Col>
                          </Row>
                        }
                      </div>
                    </div>
                  )
                })}     
              </Card.Body>
              
            </Card>
            
          </Col>
        </Row>
        {/* <Row> */}
          {/* <Col> */}
            {/* <LoadScript
              googleMapsApiKey = {API_KEY}
            >
              <GoogleMap
                mapContainerClassName="map-container"
                center={getCenter(activ.coord)}
                zoom={12}
              >
                <Marker position={getCenter(activ.coord)}/>
              </GoogleMap>
            </LoadScript> */}
          {/* </Col> */}
        {/* </Row> */}
      </Container>
    </div>
  )
}

export default Activ;