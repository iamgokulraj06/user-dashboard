import React from 'react';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Loader.css'; // Assuming you have a CSS file for custom styling

function Loader() {
  return (
    <div className="loader-backdrop">
      <Spinner animation="border" role="status" variant="dark" className="loader-spinner">
        <span className="sr-only"></span>
      </Spinner>
    </div>
  );
}

export default Loader;
