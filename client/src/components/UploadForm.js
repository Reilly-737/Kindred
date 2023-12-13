import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "react-bootstrap";

function getValidationSchema(values) {
  let schema = Yup.object({
    title: Yup.string().required("Required"),
    body: Yup.string(),
    image_file: Yup.mixed(),
    tags: Yup.array()
      .min(1, "Choose at least one tag")
      .of(Yup.number().typeError("Must be a number").required("Required")),
  });

  if (values.postType === "discussion") {
    schema = schema.shape({
      body: Yup.string().required("Required"),
    });
  }

  if (values.postType === "artwork") {
    schema = schema.shape({
      image_file: Yup.mixed().required("A file is required for artwork"),
    });
  }

  return schema;
}

const UploadForm = ({ onSubmit, tags, showLoginAlert }) => {
  return (
    <Formik
      initialValues={{
        postType: "artwork",
        title: "",
        body: "",
        tags: [],
        image_file: "", //add this for cloudinary
      }}
      validationSchema={(formikValues) => getValidationSchema(formikValues)}
      onSubmit={onSubmit}
      // validationSchema={Yup.object({
      //   title: Yup.string().required("Required"),
      //   body: Yup.string().when("postType", {
      //     is: "discussion",
      //     then: Yup.string().required("Required"),
      //     otherwise: Yup.string(),
      //   }),
      //   image_file: Yup.mixed().when("postType", {
      //     is: "artwork",
      //     then: Yup.mixed().required("A file is required for artwork"),
      //     otherwise: Yup.mixed(),
      //   }),
      //   tags: Yup.array()
      //     .min(1, "Choose at least one tag")
      //     .of(Yup.number().typeError("Must be a number").required("Required")),
      // })}
      // onSubmit={onSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="mb-3">
            <label htmlFor="postType" className="form-label">
              Please Choose Upload Type!
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
                name="image_file"
                type="file"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  console.log("Selected file:", file);
                  setFieldValue("image_file", file);
                }}
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
            <Field as="select" name="tags" className="form-control" multiple>
              {tags.map((tag) => (
                <option key={tag.tag_id} value={tag.tag_id}>
                  {" "}
                  {tag.title}{" "}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tags" component="div" className="text-danger" />
          </div>
          <div className="mb-3">
            <Button type="submit" disabled={showLoginAlert}>
              Create!
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UploadForm;
