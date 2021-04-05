import Modal from "react-bootstrap/Modal"
import Col from "react-bootstrap/Col"
import styles from "../styles/components/DeletePost.module.scss"
import Row from "react-bootstrap/Row"
import Image from "react-bootstrap/Image"
import Button from "react-bootstrap/Button"

import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { getAccessToken } from "./accessToken"

export const DeletePost = (props: any) => {
  const dispatch = useDispatch()
  const posts = useSelector((state: any) => state.userInfo)
  const user = useSelector((state: any) => state.userInfo.user)
  const darkThemeEnabled = useSelector((state: any) => state.userInfo.light)

  const onSubmit = (actions: any) => {
    axios("http://ec2-34-207-154-73.compute-1.amazonaws.com/api/deletePost", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAccessToken(),
      },
      method: "delete",
      data: JSON.stringify({
        ID: props.posts.ID,
      }),
    }).then((r) => {
      if (r.status === 200) {
        props.setShow(false)

        dispatch({
          type: "DELETE_POST",
          payload: r.data,
        })
      }
    })
  }

  return (
    <div>
      <Modal
        style={{ marginTop: "15vh" }}
        show={props.show}
        onHide={props.handleClose}
      >
        <Modal.Header
          id={darkThemeEnabled ? styles.deleteLightMode : styles.deleteDarkMode}
          closeButton
        >
          <Modal.Title>Delete Post</Modal.Title>
        </Modal.Header>

        <Modal.Body
          id={darkThemeEnabled ? styles.deleteLightMode : styles.deleteDarkMode}
          key={props.posts.ID}
        >
          <Col>
            <Row>
              <Col md="auto" id={styles.messageBoxPhotoContainer}>
                <Image
                  id={styles.messageBoxPhoto}
                  src={user.ProfilePhoto}
                  rounded
                />
              </Col>
              <Col md="auto" id={styles.messageBoxUsername}>
                <h5 id={styles.usernameText}>{posts.user.Username}</h5>
                <h6 id={styles.usernameText}>{posts.user.ScreenName}</h6>
              </Col>
            </Row>
          </Col>
          <Col md="auto" id={styles.messageBoxMessage} key={props.posts.ID}>
            {props.posts.Message}
          </Col>
        </Modal.Body>

        <Modal.Footer
          id={darkThemeEnabled ? styles.deleteLightMode : styles.deleteDarkMode}
          style={{ padding: "5px 10px 10px 0" }}
        >
          <Button variant="danger" onClick={onSubmit} type="submit">
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
