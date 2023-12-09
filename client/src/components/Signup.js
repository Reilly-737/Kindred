import React, {useState} from 'react';
import FormComp from '../components/Form';
import {Container, Row, Col } from 'reactstrap';
import Confetti from "react-confetti";

const Signup = () => {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleFormSubmit =() => {
        //logic here
        setIsSubmitted(true)
    }
  return (
    <div className="main">
      <Container>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <h2>Join the Fun!</h2>;
            <FormComp mode="signup" onSubmit={handleFormSubmit}/>
            {isSubmitted && <Confetti/>}
            <div>
              <div className="cont">
                <button color="primary" className="btn" onClick={handleFormSubmit}>
                 Submit
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Signup;