import React from "react";
import { Container, Row, Col } from "reactstrap";

const AboutUs = () => {
  return (
    <Container>
      <h1>about us</h1>

      <Row>
        <Col sm="12" md="6">
          <h2>terms of service</h2>
          <p>Welcome of Kindred! </p>
          <p>
            A community dedicated to sharing and discussing the beauty of art!
            Before you embark on this creative journey, please take moment to
            read our terms:
          </p>
          <p>
            Respectful Community: Any content that promotes
            discrimination, hate, or harm will not be tolerated.{" "}
          </p>
          <p>
            Originality Matters: Plagiarism is strictly prohibited.
          </p>
          <p>
            Wholesome Environment: Constructive criticism is welcome, but any form of
            bulling or harassment will result in immediate action.{" "}
          </p>
          <p>
            Privacy and Data Protection: We value your privacy. Do not share
            personal information about yourself or others without consent.
          </p>
          <p>
            Updates and Changes: We reserve the right to update these terms to
            better serve the community. You will be notified of any significant
            changes. By using Kindred, you agree to abide by these terms.
          </p>
          <p> We're excited to have you as part of our creative community!</p>
        </Col>

        <Col sm="12" md="6">
          <h2>about the admin</h2>

          <p>
            I'm Reilly, the creator of Kindred! As an artist
            myself, specializing in expressionist, childlike forms, my pieces
            delve into the odd realms of body dysmorphia, disconnection,
            death, existentialism, and spirituality. Through my art, I aim to 
            explore what this existence means to me and what does it mean to be alive?
          </p>
          <p>
            Kindred is more than just a platform; it's a departure from
            conventional norms, a celebration of the diverse expressions that
            make every individual an artist. Here, we believe that living and
            being are acts of performance art, and everyone has a canvas to
            contribute to the masterpiece of existence. Join us at Kindred,
            where every brushstroke, sculpture, or performance is a step towards
            fostering a community that appreciates artistic expression.
          </p>
          <img
            src="https://i.imgur.com/dPAXC9U.jpg"
            alt="Admin"
            style={{ maxWidth: "15%", borderRadius: "3px", marginTop: "5px" }}
          />
          <div className="social-links mt-3">
            <a
              href="https://github.com/Reilly-737"
              target="_blank"
              rel="noopener noreferrer"
              className="mr-3"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/reilly-wentz"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
