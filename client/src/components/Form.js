import { Formik, Field, Form, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import * as Yup from "yup";

const FormComp = ({ mode = "signup", onSubmit }) => {
  const { user, updateUser, setAlertMessage, handleSnackType } =
    useOutletContext();
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  const url = user ? `/users/${userInfo.id}` : "/register";
  //const redirectAfterLogin = user ? "/" : "/upload";

  useEffect(() => {
    if (user) {
      fetch(`/users/${user.id}`)
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          } else {
            throw new Error(resp.statusText);
          }
        })
        .then(setUserInfo)
        .catch((err) => {
          handleSnackType("error");
          setAlertMessage(err.message);
        });
    }
  }, [user, handleSnackType, setAlertMessage]);

  return (
    <Formik
      initialValues={{
        username: userInfo.username || "",
        email: userInfo.email || "",
        bio: userInfo.bio || "",
        password: "",
      }}
      validationSchema={Yup.object({
        username: Yup.string()
          .min(3, "Must be at least 3 characters")
          .required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
        bio: Yup.string()
          .min(50, "Must be at least 50 characters")
          .required("Required"),
        password:
          mode === "signup"
            ? Yup.string()
                .min(8, "Must be at least 8 characters")
                .required("Required")
            : Yup.string(),
      })}
      onSubmit={(values, { setSubmitting }) => {
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, ongoing: true }),
        })
          .then((resp) => {
            if (resp.ok) {
              return resp.json();
            } else {
              throw new Error(resp.statusText);
            }
          })
          .then((newUser) => {
            updateUser(newUser);
            handleSnackType("success");
            setAlertMessage(
              "Welcome! We are so excited to have you here!",
              "A fun surprise when you post your art for the first time, your art will be displayed on the front page for 24 hours!",
              "Can't wait to see your work!"
            );
            onSubmit(); 
            navigate(user ? `/profile/${newUser.id}` : "/upload");
          })
          .catch((error) => {
            handleSnackType("error");
            setAlertMessage(error.message);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      <Form>
        <div>
          <label htmlFor="username">Username</label>
          <Field name="username" type="text" className="block" />
          <ErrorMessage name="username" className="block" />

          <label htmlFor="email">Email Address</label>
          <Field name="email" type="email" className="block" />
          <ErrorMessage name="email" className="block" />

          <label htmlFor="bio">Bio</label>
          <Field name="bio" type="textarea" className="block textarea" />
          <ErrorMessage name="bio" className="block" />

          {mode === "signup" && (
            <>
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="block" />
              <ErrorMessage name="password" className="block" />
            </>
          )}
        </div>
        <div className="buttons">
          <button type="submit">
            {mode === "signup" ? "Sign Up" : "Login"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default FormComp;
