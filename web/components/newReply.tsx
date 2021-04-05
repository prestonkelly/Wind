import Modal from "react-bootstrap/Modal"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import styles from "../styles/components/Posts.module.scss"
import Row from "react-bootstrap/Row"
import Image from "react-bootstrap/Image"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import React from "react"
import { Formik, FormikProps, FormikValues } from "formik"
import * as Yup from "yup"
import { useSelector } from "react-redux"
import axios from "axios"
import { getAccessToken } from "./accessToken"

// Strict types for initial values
interface initValuesType {
  reply: string
}

// Setting initial values for sign up form
const initialValues: initValuesType = {
  reply: "",
}

const validationSchema = Yup.object().shape({
  reply: Yup.string().max(255, "Message is too long"),
})

export const NewReply = (props: any) => {
  const posts = useSelector((state: any) => state.userInfo)
  const user = useSelector((state: any) => state.userInfo.user)
  const darkThemeEnabled = useSelector((state: any) => state.userInfo.light)

  const onSubmit = (values: initValuesType, actions: any) => {
    axios("http://ec2-34-207-154-73.compute-1.amazonaws.com/api/reply", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAccessToken(),
      },
      method: "post",
      data: JSON.stringify({
        ID: props.posts.ID,
        Message: values.reply,
      }),
    }).then((r) => {
      if (r.status === 200) {
        props.setShow(false)
        actions.resetForm({
          reply: "",
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
          <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header
              id={
                darkThemeEnabled ? styles.replyLightMode : styles.replyDarkMode
              }
              closeButton
            >
              <Modal.Title>New Reply</Modal.Title>
            </Modal.Header>

            <Modal.Body id={darkThemeEnabled ? null : styles.postDarkMode}>
              <Card
                style={{
                  borderWidth: "2px",
                }}
                id={darkThemeEnabled ? null : styles.replyCardDarkMode}
              >
                <Card.Body style={{ padding: "10px" }} key={props.posts.ID}>
                  <Col>
                    <Row>
                      <Col md="auto" id={styles.messageBoxPhotoContainer}>
                        <Image
                          id={styles.messageBoxPhoto}
                          src={props.posts.ProfilePhoto}
                          rounded
                        />
                      </Col>
                      <Col md="auto" id={styles.messageBoxUsername}>
                        <h5 id={styles.usernameText}>{posts.user.Username}</h5>
                        <h6 id={styles.usernameText}>
                          {posts.user.ScreenName}
                        </h6>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    md="auto"
                    id={styles.messageBoxMessage}
                    key={props.posts.ID}
                  >
                    {props.posts.Message}
                  </Col>
                </Card.Body>
              </Card>
              <div
                id={
                  darkThemeEnabled
                    ? styles.replyLinkLightMode
                    : styles.replyLinkDarkMode
                }
              />
              <Card id={darkThemeEnabled ? null : styles.replyCardDarkMode}>
                <Form.Control
                  type="text"
                  name="reply"
                  placeholder="Reply..."
                  onChange={handleChange}
                  value={values.reply}
                  as="textarea"
                  rows={2}
                  id={darkThemeEnabled ? null : styles.replyCardDarkMode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.reply}
                </Form.Control.Feedback>
              </Card>
            </Modal.Body>

            <Modal.Footer
              id={
                darkThemeEnabled ? styles.replyLightMode : styles.replyDarkMode
              }
              style={{ padding: "5px 10px 5px 0" }}
            >
              <Form noValidate onSubmit={handleSubmit}>
                <Button
                  variant={darkThemeEnabled ? "outline-dark" : "outline-light"}
                  type="submit"
                >
                  Reply
                </Button>
              </Form>
            </Modal.Footer>
          </Modal>
        )
      }}
    </Formik>
  )
}
