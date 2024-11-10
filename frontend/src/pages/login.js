import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import myImage from '../assets/loginpic.png';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import "../styles/login.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);  // State to toggle between login and register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');  // For registration
  const [name, setName] = useState('');  // For registration
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const LoginHandler = async (e) => {
    e.preventDefault();
    setErrorMessage('');  // Clear previous error messages

    try {
      const response = await axios.post('http://localhost:7000/login', { email, password });
      
      if (response.data.status === 'error') {
        setErrorMessage(response.data.message || 'Invalid credentials');
      } else {
        const authToken = response.data.data.authToken
        localStorage.setItem("authToken"  , authToken)
        localStorage.setItem("email" , email)
        navigate('/home');  // Redirect to the profile page on success
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      console.error("Login error:", error);
    }
  };

  // Handle registration form submission
  const RegisterHandler = async (e) => {
    e.preventDefault();
    setErrorMessage('');  // Clear previous error messages

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/register', { 
        
        "name": name,
        "email": email,
        "password": password,
        "confirmPassword": confirmPassword
      
      });

      if (response.data.status === 'error') {
        setErrorMessage(response.data.message || 'Registration failed');
      } else {
        const authToken = response.data.data.authToken
        localStorage.setItem("authToken"  , authToken)
        localStorage.setItem("email" , email)
        navigate('/home');  // Redirect to the profile page on success
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      console.error("Registration error:", error);
    }
  };

  return (
    <section className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="login-card p-0 p-md-4" style={{ maxWidth: '950px', width: '100%' }}>
        <Row className="g-0">
          {/* Left Column - Image */}
          <Col md={6} className="d-none d-md-block p-5">
            <Card.Img src={myImage} alt="Login Image" style={{ height: '100%', objectFit: 'cover' }} />
          </Col>

          {/* Right Column - Form */}
          <Col md={6} className="p-4">
            <Card.Body>
              <h4 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h4>
              
              {/* Toggle Button */}
              <div className="text-center mb-4">
                <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={isLogin ? LoginHandler : RegisterHandler} className="d-flex flex-column" style={{ textAlign: "left" }}>
                
                {!isLogin && (
                  <div className="mb-3">
                    <label className='mb-2'>Name</label>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      value={name}
                      placeholder="Full Name"
                      className="common-input"
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className='mb-2'>Email</label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    value={email}
                    placeholder="Email"
                    className="common-input"
                  />
                </div>

                <div className="mb-3">
                  <label className='mb-2'>Password</label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    value={password}
                    placeholder="Enter Password"
                    className="common-input"
                  />
                </div>

                {!isLogin && (
                  <div className="mb-3">
                    <label className='mb-2'>Confirm Password</label>
                    <input
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                      value={confirmPassword}
                      placeholder="Confirm Password"
                      className="common-input"
                    />
                  </div>
                )}

                {errorMessage && (
                  <div className="text-danger mb-3" style={{ textAlign: 'center' }}>
                    {errorMessage}
                  </div>
                )}

                <button type="submit" id="submit-btn" className="common-btn mt-3">
                  {isLogin ? 'Login' : 'Register'}
                </button>
              </form>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </section>
  );
};

export default AuthPage;
