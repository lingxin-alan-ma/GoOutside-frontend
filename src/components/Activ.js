import React, { useState, useEffect } from 'react';
import ActivDataService from '../services/activs';
import { Link, Navigate, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import moment from 'moment';


const Activ = ({ user }) => {

  let params = useParams();

  const [activ, setActiv] = useState({
    id: null,
    title: "",
    rated: "",
    reviews: []
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
    getActiv(params.id)
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

  return (
    <div>
      <Container>
        <Row>
          <Col>
          <div className="poster">
          <Image
            className="bigPicture"
            src={activ.poster+"/100px250"}
            alt={"poster not available"}
            onError={event => {
              event.target.src = "../images/NoPosterAvailable-crop.jpg"
              event.onerror = null
            }}
            fluid />
            </div>
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">{activ.title}</Card.Header>
              <Card.Body>
                <Card.Text>
                  {activ.plot}
                </Card.Text>
                { user &&
                  <Link to={"/activs/" + params.id + "/review"}>
                    Add Review
                  </Link> }
              </Card.Body>
            </Card>
            <h2>Reviews</h2>
            <br></br>
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
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Activ;