import React from 'react';
import { Container, Card, Row, Col, Image } from 'react-bootstrap';
import usePostRequest from '../hooks/useApi';

const Home = () => {
  // Fetching data via the usePostRequest hook
  const { responseData, error, isResponseDone } = usePostRequest('/getFeed', {});
  console.log(responseData);

  // Extracting user data and feeds from the responseData
  const userData = responseData?.data?.userDoc || {};
  const feeds = responseData?.data?.feeds || [];

  return (
    <Container className="py-4">
      {/* Welcome Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={12}>
              <h1 className="h3 mb-2">Welcome back, {userData.name}!</h1>
              <p className="text-muted">
                Last login: {new Date(userData.lastLoginAt * 1000).toLocaleString()}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Feed Section Heading */}
      <h2 className="mb-4 text-center">Feed</h2>

      {/* Feed Cards or No Feeds Message */}
      {feeds.length > 0 ? (
        feeds.map((feed) => (
          <Card key={feed.activityId || feed.createdAt} className="mb-4 shadow-sm rounded-3" style={{ maxWidth: '800px', margin: 'auto' }}>
            <Card.Body>
              {/* Author Info */}
              <div className="d-flex align-items-center mb-3">
                <Image
                  src={feed.profilePic || '/api/placeholder/48/48'}
                  alt={feed.name}
                  roundedCircle
                  className="me-3"
                  style={{ width: '48px', height: '48px' }}
                />
                <div>
                  <h3 className="h6 mb-0">{feed.name}</h3>
                  <p className="text-muted small mb-0">{feed.fromEmail}</p>
                  <small className="text-muted">
                    {new Date(feed.createdAt * 1000).toLocaleString()}
                  </small>
                </div>
              </div>

              {/* Post Content */}
              {feed.activityType === 'posts' && (
                <p className="mb-3" style={{ fontSize: '1.1rem', color: '#333' }}>{feed.postText}</p>
              )}

              {/* Profile Picture Update */}
              {feed.activityType === 'profilePic' && (
                <div className="text-center mb-3">
                  <p>{feed.name} has updated their profile picture</p>
                  <Image
                    src={feed.profilePic}
                    alt="Updated Profile Picture"
                    roundedCircle
                    className="mb-3"
                    style={{ width: '150px', height: '150px' }}
                  />
                </div>
              )}

              {/* Optional Image (Feed) */}
              {feed.imageUrl && (
                <div className="text-center mb-3">
                  <Image
                    src={feed.imageUrl}
                    alt="Post content"
                    fluid
                    className="rounded-3"
                    style={{ maxWidth: '90%', maxHeight: '400px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card className="mb-4 shadow-sm rounded-3" style={{ maxWidth: '800px', margin: 'auto' }}>
          <Card.Body className="text-center">
            <h4 className="mb-3">Currently, there are no feeds from your friends</h4>
            <p className="text-muted">Check back later for updates!</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Home;
