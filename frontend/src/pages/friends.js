import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Image, ListGroup , Alert} from 'react-bootstrap';
import usePostRequest from '../hooks/useApi';
import { usePostRequestDynamicUrlFunction } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import defaultProfilePic from '../assets/userimage.png'



const PendingRequests = ({ pendingRequests , friendsList , setPendingRequest , setFriendsList  }) =>{ 

  const { executePostRequest } = usePostRequestDynamicUrlFunction()

  const acceptFriendHandler = async (email) => {
    try {
      const responseData = await executePostRequest("/acceptFriendRequest" , {"email" : email})
      const acceptedFriend = pendingRequests.find(request => request.email === email);
      console.log(acceptedFriend , "hai")
      setFriendsList((prevFriendsList) => [acceptedFriend, ...prevFriendsList]);
      setPendingRequest(prevPendingRequests => prevPendingRequests.filter(request => request.email !== email));

    } catch (e) {
      console.log(e)
    }
  }

  return  (
  <Card className="mb-4">
    <Card.Header>Pending Friend Requests</Card.Header>
    <Card.Body>
      {pendingRequests && pendingRequests.length > 0 ? (
        <ListGroup variant="flush">
          {pendingRequests.map((request, index) => (
            <ListGroup.Item key={index}>
              <Row className="align-items-center">
                <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
                  <Image
                    src={request.profilePic || defaultProfilePic}
                    roundedCircle
                    fluid
                    alt="Profile Pic"
                  />
                </Col>
                <Col xs={12} md={6} className="text-center text-md-start mb-3 mb-md-0">
                  <Card.Title>{request.name}</Card.Title>
                  <Card.Text>
                    {request.email} {/* Display email as bio is not in the schema */}
                  </Card.Text>
                </Col>
                <Col xs={12} md={3} className="text-center text-md-end">
                  <Button onClick={() => acceptFriendHandler(request.email)} variant="primary" size="sm">
                    Accept Friend
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Card.Text>No pending friend requests</Card.Text>
      )}
    </Card.Body>
  </Card>
)}

const FriendsList = ({ friends }) => {
  const navigate = useNavigate();
  return (
  <Card>
    <Card.Header>Friends List</Card.Header>
    <Card.Body>
      {friends && friends.length > 0 ? (
        <ListGroup variant="flush">
          {friends.map((friend, index) => (
            <ListGroup.Item key={index}>
              <Row className="align-items-center">
                <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
                  <Image
                    src={friend.profilePic || defaultProfilePic} 
                    roundedCircle
                    fluid
                    alt="Friend Profile Pic"
                  />
                </Col>
                <Col xs={12} md={6} className="text-center text-md-start mb-3 mb-md-0">
                  <Card.Title>{friend.name}</Card.Title>
                  <Card.Text>{friend.email}</Card.Text>
                </Col>
                <Col xs={12} md={3} className="text-center text-md-end">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => navigate(`/viewprofile?email=${encodeURIComponent(friend.email)}`)}
                >
                  View Profile
              </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Card.Text>No friends found</Card.Text>
      )}
    </Card.Body>
  </Card>
)}

const Friends = () => {
  const { responseData, error, isResponseDone } = usePostRequest('/getFriends', {});



  const pendingRequestsResponse = responseData?.data?.pendingFriendRequests || [];

  const friendsListResponse = responseData?.data?.friends || [];

  const [pendingRequests , setPendingRequest] = useState(pendingRequestsResponse)
  const [friendsList , setFriendsList] = useState(friendsListResponse)

  console.log(friendsList)

  useEffect(() => {
    setPendingRequest(pendingRequestsResponse)
    setFriendsList(friendsListResponse)
  } , [responseData , error , isResponseDone])

  return (
    <div className="container mt-5">
      { isResponseDone && <PendingRequests setFriendsList={setFriendsList} setPendingRequest={setPendingRequest} pendingRequests={pendingRequests} friendsList={friendsList} />}

      { isResponseDone && <FriendsList friends={friendsList}/>}

      {error && (
        <Alert variant="danger">
          Something went wrong! Please try again later.
        </Alert>
      )}
    </div>
  );
};

export default Friends;
