import React, { useState , useEffect } from 'react';
import { Container, Row, Col, Form, Card, Image, Button ,  Alert  } from 'react-bootstrap';
import usePostRequest from '../hooks/useApi'
import defaultProfileImage from '../assets/userimage.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { postDataCustom } from '../utils/common';

const pageSize = 100

const FindPeople = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage , setCurrentPage ] = useState(1)
  const [userProfileData , setUserProfileData] = useState([])
  const [isLastPage, setIsLastPage] = useState(false);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const [requestBody , setRequestBody] = useState({
    searchString: searchQuery,
    skip: (currentPage - 1) * pageSize,
    limit: pageSize,
  })

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submit behavior
    setUserProfileData([]); // Clear previous results
    setCurrentPage(1); // Reset to the first page
    // Update request body with new searchQuery
    setRequestBody({
      searchString: searchQuery,
      skip: 0,
      limit: pageSize,
    });
  };


  const { responseData, error, isResponseDone } = usePostRequest('/searchPeople', requestBody , [requestBody]);

  useEffect(() => {
    if (isResponseDone) {
      if (error) {
        setUserProfileData([]);
        setIsLastPage(true);
      } else if (responseData && responseData.data.people.length > 0) {
        setUserProfileData((prevData) => [...prevData, ...responseData.data.people]);
        setIsLastPage(responseData.length < pageSize); 
      } else {
        setIsLastPage(true); // No data returned
      }
    }
  }, [responseData, error, isResponseDone]);

  return (
    <Container className="my-4">
      <h1 className="mb-4 text-center">Find Other People</h1>
      
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={8} lg={6}>
        <Form onSubmit={handleSearchSubmit}>
            <Form.Control
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="shadow-sm"
            />
          </Form>
        </Col>
      </Row>

      {error && (
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8} lg={6}>
            <Alert variant="danger">An error occurred. Please try again later.</Alert>
          </Col>
        </Row>
      )}

    {isResponseDone && (
        <UserProfileCards userProfileData={userProfileData}/>
    )}

    </Container>
  );
};

const UserProfileCards = ({userProfileData}) => {

    const handleSendFriendRequest = async (email , targetButton) => {

        try {
            const responseData = await postDataCustom("/giveFriendRequest" , {"email" : email})
            targetButton.textContent = "Request Sent"
        }catch (e) {
            targetButton.textContent = "Failed To Send Request"
        }
    }


    return (
        <Row>
        {userProfileData.map((user, index) => (
          <Col key={index} xs={12} md={6} lg={4} className="mb-4">
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Image
                  src={user.profilePic || defaultProfileImage } // lese myImage 
                  roundedCircle
                  width={100}
                  height={100}
                  className="mb-3"
                  alt={"No Pic"}
                />
                <Card.Title>{user.name || `Person ${index + 1}`}</Card.Title>
                <Card.Text>{user.bio || 'Short bio or details about this person.'}</Card.Text>
                <Button onClick={e => handleSendFriendRequest(user.email , e.target)} variant="primary" className="mt-3">
                  Send Request
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    )
}

export default FindPeople;
