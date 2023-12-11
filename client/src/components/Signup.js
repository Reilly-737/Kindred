import React, {useState} from 'react';
import FormComp from './Form';
import {Container, Row, Col } from 'reactstrap';

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
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Signup;