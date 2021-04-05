import Modal from "react-bootstrap/Modal"
import Col from "react-bootstrap/Col"
import styles from "../styles/components/EditPost.module.scss"
import Row from "react-bootstrap/Row"
import Image from "react-bootstrap/Image"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import React from "react"
import { Formik, FormikProps, FormikValues } from "formik"
import * as Yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { getAccessToken } from "./accessToken"

// Strict types for initial values
interface initValuesType {
  message: string
}

const validationSchema = Yup.object().shape({
  message: Yup.string().max(255, "Message is too long"),
})

export const EditPost = (props: any) => {
  const dispatch = useDispatch()
  const posts = useSelector((state: any) => state.userInfo)
  const user = useSelector((state: any) => state.userInfo.user)
  const darkThemeEnabled = useSelector((state: any) => state.userInfo.light)

  // Setting initial values for sign up form
  const initialValues: initValuesType = {
    message: props.posts.Message,
  }

  const onSubmit = (values: initValuesType, actions: any) => {
    axios("http://ec2-34-207-154-73.compute-1.amazonaws.com/api/editPost", {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
      method: "put",
      data: JSON.stringify({
        ID: props.posts.ID,
        Message: values.message,
      }),
    }).then((r) => {
      if (r.status === 200) {
        props.setShow(false)
        dispatch({
          type: "UPDATE_POST_MESSAGE",
          payload: r.data,
        })
      }
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(formikProps: FormikProps<FormikValues>) => {
        const { values, errors, handleChange, handleSubmit } = formikProps
        return (
          <Modal
            style={{ marginTop: "15vh" }}
            show={props.show}
            onHide={props.handleClose}
          >
            <Modal.Header
              id={darkThemeEnabled ? styles.editLightMode : styles.editDarkMode}
              closeButton
            >
              <Modal.Title>Edit Post</Modal.Title>
            </Modal.Header>

            <Modal.Body
              id={darkThemeEnabled ? styles.editLightMode : styles.editDarkMode}
              key={props.posts.ID}
            >
              <Col>
                <Row>
                  <Col md="auto" id={styles.messageBoxPhotoContainer}>
                    <Image
                      id={styles.messageBoxPhoto}
                      src={user.ProfilePhoto}
                      rounded
                      alt={""}
                    />
                  </Col>
                  <Col md="auto" id={styles.messageBoxUsername}>
                    <h5 id={styles.usernameText}>{posts.user.Username}</h5>
                    <h6 id={styles.usernameText}>{posts.user.ScreenName}</h6>
                  </Col>
                </Row>
              </Col>
              <Col md="auto" id={styles.messageBoxMessage} key={props.posts.ID}>
                <Form.Control
                  type="text"
                  name="message"
                  onChange={handleChange}
                  value={values.message}
                  as="textarea"
                  rows={2}
                  id={
                    darkThemeEnabled
                      ? styles.editLightModeTextBox
                      : styles.editDarkModeTextBox
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.reply}
                </Form.Control.Feedback>
              </Col>
            </Modal.Body>

            <Modal.Footer
              id={darkThemeEnabled ? styles.editLightMode : styles.editDarkMode}
              style={{ padding: "5px 10px 10px 0" }}
            >
              <Form noValidate onSubmit={handleSubmit}>
                <Button variant="success" type="submit">
                  Confirm Edit
                </Button>
              </Form>
            </Modal.Footer>
          </Modal>
        )
      }}
    </Formik>
  )
}
