import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ArtworkCard from "./ArtworkCard";
import PostCard from "./PostCard";
import UploadForm from "./UploadForm";
import AlertBar from "./AlertBar";
import { StyleContext } from "../contextstyle/StyleContext";

const Upload = () => {
  const navigate = useNavigate();
  const { user, setAlertMessage, handleSnackType } = useOutletContext();
  const [tags, setTags] = useState([]);
  const { theme } = useContext(StyleContext);
  const [uploadData, setUploadData] = useState({
    title: "",
    body: "",
    image_url: "",
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

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "kindred");
    formData.append("cloud_name", "dax59eswf");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dax59eswf/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url; 
    } catch (error) {
      console.error("Error uploading the image:", error);
      return null;
    }
  }; 

  const handleFormSubmit = async (values, { setSubmitting }) => {
    let formData = { ...values };

    if (values.postType === "artwork" && values.image_file) {
      const imageUrl = await handleImageUpload(values.image_file);
      if (imageUrl) {
        formData.image_url = imageUrl;
        delete formData.image_file;
      } else {
        setAlertMessage("Image upload failed! Please try again.");
        handleSnackType("error");
        setSubmitting(false);
        return;
      }
    }
    const endpoint =
      formData.postType === "artwork" ? "/artworks" : "/discussion-posts";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setUploadedId(responseData.id);

        handleSnackType("success");
        setAlertMessage("Upload successful!");
        navigate(`/profile/${user.user_id}`);
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
    <Container
      style={{ color: theme.primaryColor, backgroundColor: theme.background }}
    >
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
    </Container>
  );
};

export default Upload;
