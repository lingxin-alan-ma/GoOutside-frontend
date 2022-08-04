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

const images = [
  "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1525721653822-f9975a57cd4c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1496545672447-f699b503d270?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80",
  "https://images.unsplash.com/photo-1600403477955-2b8c2cfab221?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1601226041388-8bbabdd6e37e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
];

const ActivsList = ({
  user,
  favorites,
  addFavorite,
  deleteFavorite
}) => {
  // useState to set state values
  const [activs, setActivs] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [tags, setTags] = useState(["All Tags"]);
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");

  const retrieveTags = useCallback(() => {
    ActivDataService.getTags()
      .then(response => {
        setTags(["All Tags"].concat(response.data))
      })
      .catch(e => {
        console.log(e);
      })
  }, []); // empty array as 2nd arg of useCallback: this func has no dependencies

  const retrieveActivs = useCallback(() => {
    setCurrentSearchMode("");
    ActivDataService.getAll(currentPage)
      .then(response => {
        // console.log(response.data.activs);
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

  const findByTag = useCallback(() => {
    setCurrentSearchMode("findByTag");
    if (searchTag === "All Tags") {
      retrieveActivs();
    } else {
      find(searchTag, "tags");
    }
  }, [find, searchTag, retrieveActivs]);

  const retrieveNextPage = useCallback(() => {
    if (currentSearchMode === "findByName") {
      findByName();
    } else if (currentSearchMode === "findByTag") {
      findByTag();
    } else {
      retrieveActivs();
    }
  }, [currentSearchMode, findByName, findByTag, retrieveActivs]);

  // Use effect to carry out side effect functionality
  useEffect(() => {
    retrieveTags();
  }, [retrieveTags]);

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

  const onChangeSearchTag = e => {
    const searchTag = e.target.value;
    setSearchTag(searchTag);
  }

  return (
    <div className="App">
      <Container className="main-container">
        <Form>
          <Row>
            <Col>
            <img 
              src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
              alt="hiking" 
              className="frontPageImgs"
              style={{maxHeight: 500}}
            />
            <Form.Group className="mb-3">
              <Form.Control
              type="text"
              placeholder="Search by city, name, or activities"
              value={searchName}
              onChange={onChangeSearchName}
              />
            </Form.Group>
            <Button 
              variant="light"
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
                  onChange={onChangeSearchTag}
                >
                  { tags.map((tag, i) => {
                    return (
                      <option value={tag}
                      key={i}>
                        {tag}
                      </option>
                    )
                  })}
                </Form.Control>
              </Form.Group>
              <Button 
                variant="primary"
                type="button" 
                onClick={findByTag}
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
                    <Card.Title> {activ.name}</Card.Title>
                    <Card.Text className="activTags" style={{color: "blue"}}>
                      Tags: { activ.tags.map((tag, i) => {
                        return (
                          <option value={tag}
                          key={i}>
                            {tag}
                          </option>
                        )
                      })}
                    </Card.Text>  
                    <Card.Text>
                      {activ.address[1]}
                    </Card.Text>
                    <Card.Text className="activDescription">
                      {activ.description}
                    </Card.Text>
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