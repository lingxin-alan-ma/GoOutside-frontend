import React, { useState, useEffect, useCallback } from 'react';
import ActivDataService from "../services/activs";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
// import { BsStar, BsStarFill } from "react-icons/bs";
import { BsHeart, BsHeartFill } from "react-icons/bs";

import "./ActivsList.css";

const ActivsList = ({
  user,
  favorites,
  addFavorite,
  deleteFavorite
}) => {
  // useState to set state values
  const [activs, setActivs] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchRating, setSearchRating] = useState("");
  // const [ratings, setRatings] = useState(["All Ratings"]);
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");

  // const retrieveRatings = useCallback(() => {
  //   ActivDataService.getRatings()
  //     .then(response => {
  //       setRatings(["All Ratings"].concat(response.data))
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     })
  // }, []); // empty array as 2nd arg of useCallback: this func has no dependencies

  const retrieveActivs = useCallback(() => {
    setCurrentSearchMode("");
    ActivDataService.getAll(currentPage)
      .then(response => {
        setActivs(response.data.activs);
        setCurrentPage(response.data.page);
        setEntriesPerPage(response.data.entries_per_page);
      })
      .catch(e => {
        console.log(e);
      });
  }, [currentPage]);

  const find = useCallback((query, by) => {
    ActivDataService.find(query, by, currentPage)
      .then(response => {
        setActivs(response.data.activs);
      })
      .catch(e => {
        console.log(e);
      });
  }, [currentPage]);

  const findByName = useCallback(() => {
    setCurrentSearchMode("findByName");
    find(searchName, "title");
  }, [find, searchName]);

  const findByRating = useCallback(() => {
    setCurrentSearchMode("findByRating");
    if (searchRating === "All Ratings") {
      retrieveActivs();
    } else {
      find(searchRating, "rated");
    }
  }, [find, searchRating, retrieveActivs]);

  const retrieveNextPage = useCallback(() => {
    if (currentSearchMode === "findByName") {
      findByName();
    } else if (currentSearchMode === "findByRating") {
      findByRating();
    } else {
      retrieveActivs();
    }
  }, [currentSearchMode, findByName, findByRating, retrieveActivs]);

  // Use effect to carry out side effect functionality
  // useEffect(() => {
  //   retrieveRatings();
  // }, [retrieveRatings]);

  useEffect(() => {
    setCurrentPage(0);
  }, [currentSearchMode]);

  // Retrieve the next page if currentPage value changes
  useEffect(() => {
    retrieveNextPage();
  }, [currentPage, retrieveNextPage]);


  // Other functions that are not depended on by useEffect
  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  }

  const onChangeSearchRating = e => {
    const searchRating = e.target.value;
    setSearchRating(searchRating);
  }

  return (
    <div className="App">
      <Container className="main-container">
        <Form>
          <Row>
            <Col>
            <img src="/images/toomas-tartes-Yizrl9N_eDA-unsplash-hiking.jpg" alt="hiking" className="frontPageImgs"/>
            <Form.Group className="mb-3">
              <Form.Control
              type="text"
              placeholder="Search by city, name, or activities"
              value={searchName}
              onChange={onChangeSearchName}
              />
            </Form.Group>
            <Button 
              variant="primary"
              type="button"
              onClick={findByName}
            >
              Search
            </Button>
            </Col>
            {/* <Col>
              <Form.Group className="mb-3">
                <Form.Control 
                  as="select"
                  onChange={onChangeSearchRating}
                >
                  { ratings.map((rating, i) => {
                    return (
                      <option value={rating}
                      key={i}>
                        {rating}
                      </option>
                    )
                  })}
                </Form.Control>
              </Form.Group>
              <Button 
                variant="primary"
                type="button" 
                onClick={findByRating}
              >
                Search 
              </Button>
            </Col>     */}
          </Row>
        </Form>
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
                      src={activ.poster+"/100px180"}
                      alt={"poster not available"}
                      onError={event => {
                        event.target.src = "../images/NoImageAvailable_james-wheeler-ZOA-cqKuJAA-unsplash.jpg"
                        event.onerror = null
                      }}
                      />
                  </Link>
                  <Card.Body className="activCardBody">
                    <Card.Name> {activ.name}</Card.Name>
                    <Card.Text className="activTags">
                      {/* Tags: {activ.tags} */}
                      Tags: { activ.tags.map((tag, i) => {
                        return (
                          <option value={tag}
                          key={i}>
                            {tag}
                          </option>
                        )
                      })}
                    </Card.Text>  
                    <Card.Text className="activDescription">
                      {activ.description}
                    </Card.Text>
                    {/* <Link to={"/activs/"+activ._id}>
                      View Reviews 
                    </Link> */}
                  </Card.Body>  
                </Card>
              </Col>
            )
          })}
        </Row>
        <br />
        Showing page: { currentPage + 1 }.
        <Button
          variant="link"
          onClick={() => { setCurrentPage(currentPage + 1)} }
          >
            Get next { entriesPerPage } results
          </Button>
      </Container>
    </div>
  )
}


export default ActivsList;