import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ArtworkCard from "./ArtworkCard";
import PostCard from "./PostCard";
import UploadForm from "./UploadForm";
import AlertBar from "./AlertBar";

const Upload = () => {
  const navigate = useNavigate();
  const { user, setAlertMessage, handleSnackType } = useOutletContext();
  const [tags, setTags] = useState([]);
  const [uploadData, setUploadData] = useState({
    title: "",
    body: "",
    image_file_path: "",
    tags: [],
    postType: "artwork",
  });
  const [showLoginAlert, setShowLoginAlert] = useState(!user);
  const [uploadedId, setUploadedId] = useState(null);

  useEffect(() => {
    setShowLoginAlert(!user);
    const fetchTags = async () => {
      try {
        const response = await fetch("/tags");
        if (response.ok) {
          const tagsData = await response.json();
          setTags(tagsData);
        } else {
          throw new Error("Failed to fetch tags");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTags();
  }, [user]);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const endpoint =
        values.postType === "artwork" ? "/artworks" : "/discussion-posts";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const responseData = await response.json();
        setUploadedId(responseData.id);

        handleSnackType("success");
        setAlertMessage("Upload successful!");
        navigate(`/profile/${user.id}`);
      } else {
        const errorData = await response.json();
        handleSnackType("error");
        setAlertMessage(errorData.message || "Upload failed.");
        setShowLoginAlert(!user);
      }
    } catch (error) {
      handleSnackType("error");
      setAlertMessage("An error occurred during upload.");
      setShowLoginAlert(!user);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col md={{ span: 6, offset: 3 }}>
          <UploadForm
            onSubmit={handleFormSubmit}
            tags={tags}
            showLoginAlert={showLoginAlert}
          />
        </Col>
      </Row>
      {uploadData.postType === "artwork" && uploadedId && (
        <ArtworkCard
          image={uploadData.image_file_path}
          title={uploadData.title}
          id={uploadedId}
          tags={uploadData.tags}
        />
      )}
      {uploadData.postType === "discussion" && uploadedId && (
        <PostCard
          title={uploadData.title}
          id={uploadedId}
          body={uploadData.body}
          tags={uploadData.tags}
        />
      )}
      {showLoginAlert && (
        <AlertBar
          message="Hey! Please login or sign up before uploading."
          setAlertMessage={setAlertMessage}
          snackType="warning"
          handleSnackType={handleSnackType}
        />
      )}
    </Container>
  );
};

export default Upload;
