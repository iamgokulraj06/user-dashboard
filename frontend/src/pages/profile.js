import axios from "axios";
import React, { useState , useEffect} from "react";
import {  Card, Form, Image, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import '../styles/profile.css'
import usePostRequest from '../hooks/useApi'
import { useLocation } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;


const Profile = ({isCurrentUser}) => {

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddPostModal, setShowAddPostModal] = useState(false);

  const openEditProfileModal = () => setShowEditProfileModal(true);
  const closeEditProfileModal = () => setShowEditProfileModal(false);
  const openAddPostModal = () => setShowAddPostModal(true);
  const closeAddPostModal = () => setShowAddPostModal(false);

  const [profileData, setData] = useState({});
  const [posts, setPosts] = useState([]);

  const [name, setName] = useState(null);
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState("")

  // Getting User Data
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const anotherProfileEmail = queryParams.get("email")

  const profileRequestBody = {}
  if (isCurrentUser === false) {
    profileRequestBody.getAnotherProfile = true
    profileRequestBody.anotherProfileEmail = anotherProfileEmail
    console.log("proceed")
    console.log(profileRequestBody)
  }else {
    console.log("debug")
  }
   const { responseData , error , isResponseDone} = usePostRequest("/getProfileDetails" , profileRequestBody)
   useEffect(() => {
    if (isResponseDone) {
      if (responseData.status === "success") {
        setData(responseData.data.userDoc);
        setPosts(responseData.data.userPosts);
      } else {
        alert("Error while fetching profile data");
      }
    }
  }, [isResponseDone, responseData]);
  useEffect(() => {
    if (profileData.name) {
      setName(profileData.name);
      setBio(profileData.bio);
      setProfileImage(profileData.profilePic);
    }
  }, [profileData]);

  return (
    <div className="d-flex justify-content-center my-4 flex-column gap-2 profile-container">
      <Card style={{ width: "100%", maxWidth: "600px" }} className="shadow-sm">
        <ProfileTop
          name={name}
          bio={bio}
          friendsCount={profileData.friendsCount}
          postsCount={profileData.postsCount}
          profileImage={profileImage}
          isCurrentUser={isCurrentUser}
          openEditProfileModal={openEditProfileModal} // Passing the function here
        />
      </Card>

      <Card style={{ width: "100%", maxWidth: "600px" }} className="shadow-sm">
        <PostList posts={posts} isCurrentUser={isCurrentUser} openAddPostModal={openAddPostModal} />
      </Card>

      <EditProfileModal show={showEditProfileModal}  setName={setName} setBio={setBio} setProfileImage={setProfileImage} onHide={closeEditProfileModal} />
      <AddPostModal show={showAddPostModal} setPosts={setPosts} onHide={closeAddPostModal} />
    </div>
  );
};

const ProfileTop = ({ name, bio, friendsCount, postsCount, profileImage, isCurrentUser, openEditProfileModal }) => {
  return (
    <Card.Body className="d-flex flex-column flex-md-row align-items-center">
      <Image
        src={profileImage}
        roundedCircle
        alt="Profile"
        className="mb-3 mb-md-0"
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
      <div className="ms-md-4 text-center text-md-start d-flex flex-column">
        <Card.Title>{name}</Card.Title>
        <Card.Text className="text-muted">{bio}</Card.Text>
        <div className="text-muted d-flex gap-4 justify-content-md-start justify-content-center">
          <div>
            <small>Friends</small>
            <h6>{friendsCount}</h6>
          </div>
          <div>
            <small>Posts</small>
            <h6>{postsCount}</h6>
          </div>
        </div>
        {isCurrentUser && (
          <button onClick={openEditProfileModal} className="common-btn ml-auto align-self-md-end mt-2">
            Edit Profile
          </button>
        )}
      </div>
    </Card.Body>
  );
};

const PostList = ({ posts, isCurrentUser, openAddPostModal }) => {
  return (
    <Card.Body>
      <div className="d-flex justify-content-between my-2 align-items-center">
        <h5 className="text-left mb-3">Posts</h5>

        {isCurrentUser && (
          <button className="common-btn" onClick={openAddPostModal}>
            Add Post
          </button>
        )}
      </div>
      {posts.map((post, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Card.Text style={{ textAlign: "left" }}>{post.postText}</Card.Text>
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt="Post image"
                style={{ width: "100%", height: "auto", maxHeight: "400px", marginTop: "10px" }}
              />
            )}
          </Card.Body>
        </Card>
      ))}
    </Card.Body>
  );
};

const EditProfileModal = ({ show, onHide , setName , setProfileImage , setBio }) => {
    const [nameNew, setNameNew] = useState('');
    const [bioNew, setBioNew] = useState('');
    const [profilePic, setProfilePic] = useState(null);
  
    const handleSaveChanges = async () => {
      try {
        let profilePicUrl = null;
  
        // Check if profile picture is selected
        if (profilePic) {
          // Step 1: Get the presigned URL
          const authToken = localStorage.getItem("authToken")
          const response = await axios.post(`${apiUrl}/getPreSignedUrlForProfilePic` , {
            "contentType" : profilePic.type
          } , {
            headers : {
                "authToken" : authToken
            }
        });
          const presignedUrl = response.data.data.preSignedUrl;
  
          // Step 2: Upload the profile picture to the presigned URL
          await axios.put(presignedUrl, profilePic, {
            headers: {
              'Content-Type': profilePic.type,
            },
          });
  
        //   // Step 3: Get the uploaded file's URL (assuming it returns the final URL)
          profilePicUrl = presignedUrl.split('?')[0]; // Extract base URL from the presigned URL
          setProfileImage(profilePicUrl)
          console.log(profilePicUrl)
        }
  
        // Step 4: Send the profile data to update
        const isProfilePicUpdated = profilePic ? true : false
        const authToken = localStorage.getItem("authToken")
        await axios.post(`${apiUrl}/updateProfile`, {
          name: nameNew,
          bio: bioNew,
          isProfilePicUpdated : isProfilePicUpdated
        } , {
            headers : {
                "authToken" : authToken
            }
        });
        setBio(bioNew)
        setName(nameNew)
        // Close the modal after saving
        onHide();
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    };
  
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={nameNew}
                onChange={(e) => setNameNew(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your bio"
                value={bioNew}
                onChange={(e) => setBioNew(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProfilePic">
              <Form.Label>Profile Pic</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };
  

  const AddPostModal = ({ show, onHide, setPosts }) => {
    const [postText, setPostText] = useState('');
    const [postPic, setPostPic] = useState(null);
  
    const handleAddPost = async () => {
      try {
        // Check if post text is provided (mandatory field)
        if (!postText.trim()) {
          alert("Post text is required!");
          return;
        }
  
        let postPicUrl = null;
  
        // If a post picture is provided
        let postImageId = ""
        if (postPic) {
          // Step 1: Get the presigned URL
          const authToken = localStorage.getItem("authToken");
          const response = await axios.post(`${apiUrl}/getPreSignedUrlForPost`, {
            "contentType": postPic.type
          }, {
            headers: {
              "authToken": authToken
            }
          });
  
          const presignedUrl = response.data.data.preSignedUrl;
          postImageId = response.data.data.postImageId
  
          // Step 2: Upload the post picture to the presigned URL
          await axios.put(presignedUrl, postPic, {
            headers: {
              'Content-Type': postPic.type,
            },
          });
  
          // Step 3: Extract the base URL from the presigned URL
          postPicUrl = presignedUrl.split('?')[0];
        }
  
        // Step 4: Update the post details (with or without image URL)

        const authToken = localStorage.getItem("authToken");
        const postData = {
            postText: postText,
            postImageId : postImageId,
        };
  
        await axios.post(`${apiUrl}/confirmPreSignedUrlForPost`, postData, {
          headers: {
            "authToken": authToken
          }
        });
  
        // Optionally update the state or UI to reflect the new post
        setPosts(prevPosts => [ {imageUrl : postPicUrl , postText : postText} , ...prevPosts]);
  
        // Close the modal after saving
        onHide();
      } catch (error) {
        console.error('Error adding post:', error);
      }
    };
  
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formPostText">
              <Form.Label>Post Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What's on your mind?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPostImage">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setPostPic(e.target.files[0])}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddPost}>
              Post
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

export default Profile;
