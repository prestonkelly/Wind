import * as Yup from "yup"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { Formik } from "formik"
import React, { useRef, useState } from "react"
import styles from "../styles/Settings.module.scss"
import { useDispatch, useSelector } from "react-redux"
import Col from "react-bootstrap/Col"
import Image from "react-bootstrap/Image"
import axios from "axios"
import { getAccessToken } from "./accessToken"

interface initValuesType {
  screenname: string
  username: string
  email: string
}

const validationSchema = Yup.object().shape({
  screenname: Yup.string()
    .min(4, "Please enter at least 4 characters")
    .max(255, "Screen Name is too long"),
  username: Yup.string()
    .min(4, "Please enter at least 4 characters")
    .max(255, "Username is too long"),
  email: Yup.string()
    .email("Must be a valid email")
    .max(255, "Email is too long"),
})

export const SettingsMenu = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.userInfo.user)
  const darkThemeEnabled = useSelector((state: any) => state.userInfo.light)
  const initialValues: initValuesType = {
    screenname: user.ScreenName,
    username: user.Username,
    email: user.Email,
  }

  // Code below taken from https://medium.com/@ibamibrhm/custom-upload-button-image-preview-and-image-upload-with-react-hooks-a7977618ee8c
  const [image, setImage] = useState({ preview: "", raw: "" })

  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null)

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleUploadClick = () => {
    // @ts-ignore
    hiddenFileInput.current.click()
  }
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleUploadChange = (e: any) => {
    setImage({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0],
    })
  }

  const handleDelete = () => {
    setImage({
      preview: "",
      raw: "",
    })
  }

  const formData = new FormData()
  formData.append("photo", image.raw)
  // Code above taken from https://medium.com/@ibamibrhm/custom-upload-button-image-preview-and-image-upload-with-react-hooks-a7977618ee8c

  const onSubmit = (values: initValuesType, actions: any) => {
    actions.setSubmitting(true)

    const updateUserSettings = () =>
      fetch(
        "http://ec2-34-207-154-73.compute-1.amazonaws.com/api/updateSettings",
        {
          method: "put",
          headers: {
            Authorization: "Bearer " + getAccessToken(),
          },
          credentials: "include",
          body: JSON.stringify({
            ScreenName: values.screenname,
            Username: values.username,
            Email: values.email,
          }),
        }
      )
        .then((r) => r.json())
        .then((data) => {
          if (data.Username) {
            actions.setSubmitting(false)
            dispatch({ type: "UPDATE_USER", payload: data })
          }
        })

    const updateUserPhoto = () => {
      axios(
        "http://ec2-34-207-154-73.compute-1.amazonaws.com/api/uploadPhoto",
        {
          method: "put",
          headers: {
            Authorization: "Bearer " + getAccessToken(),
          },
          data: formData,
        }
      ).then((r) => {
        if (r.status === 200) {
          actions.setSubmitting(false)
          dispatch({ type: "UPDATE_USER", payload: r.data })
        }
      })
    }

    if (formData.has("photo")) {
      updateUserPhoto()
    } else {
      updateUserSettings()
    }
  }

  const [edit, setEdit] = useState(true)

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(props) => {
        const {
          values,
          errors,
          isSubmitting,
          handleSubmit,
          handleChange,
        } = props

        return (
          <Form
            noValidate
            id={darkThemeEnabled ? null : styles.settingsDarkMode}
            onSubmit={handleSubmit}
          >
            <h2 style={{ textAlign: "center", paddingBottom: "5px" }}>
              Account Settings
            </h2>
            <div style={{ textAlign: "center" }}>
              <Button
                onClick={() => {
                  setEdit(!edit)
                }}
                variant={edit ? "success" : "light"}
                className="float-right"
              >
                Edit
              </Button>
            </div>
            <Form.Group style={{ paddingTop: "35px" }}>
              <Form.Label>Profile Photo</Form.Label>
              <Form.Row>
                <Col>
                  <Image
                    id={styles.profilePhoto}
                    src={!image.preview ? user.ProfilePhoto : image.preview}
                    rounded
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    style={{ marginLeft: "10px" }}
                    disabled={edit}
                    onClick={handleUploadClick}
                  >
                    Upload
                  </Button>
                  <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleUploadChange}
                    style={{ display: "none" }}
                    name="image"
                  />
                  <Button
                    variant={edit ? "outline-secondary" : "outline-danger"}
                    size="sm"
                    style={{ marginLeft: "10px" }}
                    disabled={edit}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Label>Screen Name</Form.Label>
            <Form.Control
              id={darkThemeEnabled ? null : styles.settingsDarkModeForm}
              type="text"
              name="screenname"
              onChange={handleChange}
              value={values.screenname}
              disabled={edit}
            />
            <Form.Control.Feedback type="invalid">
              {errors.screenname}
            </Form.Control.Feedback>
            <br />
            <Form.Label>Username</Form.Label>
            <Form.Control
              id={darkThemeEnabled ? null : styles.settingsDarkModeForm}
              type="text"
              name="username"
              onChange={handleChange}
              value={values.username}
              disabled={edit}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
            <br />
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              id={darkThemeEnabled ? null : styles.settingsDarkModeForm}
              type="text"
              name="email"
              onChange={handleChange}
              value={values.email}
              disabled={edit}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
            <br />
            <div style={{ textAlign: "center" }}>
              <Button
                variant={edit ? "light" : "success"}
                id={styles.saveButton}
                disabled={edit || isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Saving Changes" : "Save Changes"}
              </Button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
