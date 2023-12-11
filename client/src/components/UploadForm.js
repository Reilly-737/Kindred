import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Dropdown } from "react-bootstrap";

const UploadForm = ({ onSubmit, tags, showLoginAlert }) => {
  return (
    <Formik
      initialValues={{
        postType: "artwork",
        title: "",
        body: "",
        image_file_path: "",
        tags: [],
      }}
      validationSchema={Yup.object({
        title: Yup.string().required("Required"),
        body: Yup.string().when("postType", {
          is: "discussion",
          then: Yup.string().required("Required"),
        }),
        image_file_path: Yup.string().when("postType", {
          is: "artwork",
          then: Yup.string().required("Required"),
        }),
        tags: Yup.array()
          .min(1, "Choose at least one tag")
          .of(Yup.number().typeError("Must be a number").required("Required")),
      })}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="mb-3">
            <label htmlFor="postType" className="form-label">
              Choose Upload Type
            </label>
            <Field as="select" name="postType" className="form-select">
              <option value="artwork">Artwork</option>
              <option value="discussion">Discussion Post</option>
            </Field>
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <Field name="title" type="text" className="form-control" />
            <ErrorMessage name="title" className="text-danger" />
          </div>
          {values.postType === "artwork" && (
            <div className="mb-3">
              <label htmlFor="image_file_path" className="form-label">
                Image File Path
              </label>
              <Field
                name="image_file_path"
                type="text"
                className="form-control"
              />
              <ErrorMessage name="image_file_path" className="text-danger" />
            </div>
          )}
          {values.postType === "discussion" && (
            <div className="mb-3">
              <label htmlFor="body" className="form-label">
                Body
              </label>
              <Field name="body" as="textarea" className="form-control" />
              <ErrorMessage name="body" className="text-danger" />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="tags" className="form-label">
              Tags
            </label>
            <Field
              as={Dropdown}
              name="tags"
              className="block"
              onSelect={(selectedTags) => setFieldValue("tags", selectedTags)}
            >
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select Tags
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {tags.map((tag) => (
                  <Dropdown.Item key={tag.tag_id} eventKey={tag.tag_id}>
                    {tag.title}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Field>
            <ErrorMessage name="tags" className="text-danger" />
          </div>
          <div className="mb-3">
            <Button type="submit" disabled={showLoginAlert}>
              Upload
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UploadForm;
