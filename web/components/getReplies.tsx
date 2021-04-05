import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import styles from "../styles/components/Posts.module.scss"
import Row from "react-bootstrap/Row"
import Image from "react-bootstrap/Image"
import Modal from "react-bootstrap/Modal"
import React from "react"
import { useSelector } from "react-redux"

export const GetReplies = (props: any) => {
  const user = useSelector((state: any) => state.userInfo.user)
  const darkThemeEnabled = useSelector((state: any) => state.userInfo.light)

  if (!props.replies) {
    return (
      <Col id={styles.messageBox}>
        <Modal
          show={props.showReplies}
          onHide={props.handleCloseReplies}
          style={{ marginTop: "25vh" }}
        >
          <Modal.Body id={darkThemeEnabled ? null : styles.postDarkMode}>
            <Card id={darkThemeEnabled ? null : styles.postDarkMode}>
              <Card.Header>No Replies</Card.Header>
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
                      <h5 id={styles.usernameText}>{props.posts.Username}</h5>
                      <h6 id={styles.usernameText}>{props.posts.ScreenName}</h6>
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
          </Modal.Body>
        </Modal>
      </Col>
    )
  }

  return (
    <Col id={styles.messageBox}>
      <Modal
        style={{ marginTop: "15vh" }}
        show={props.showReplies}
        onHide={props.handleCloseReplies}
      >
        <Modal.Header id={darkThemeEnabled ? null : styles.replyDarkMode}>
          <h3>Replies</h3>
        </Modal.Header>
        <Modal.Body id={darkThemeEnabled ? null : styles.postDarkMode}>
          <Card id={darkThemeEnabled ? null : styles.postDarkMode}>
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
                    <div>
                      <h5 id={styles.usernameText}>{props.posts.ScreenName}</h5>
                      <h6 id={styles.usernameText}>{props.posts.Username}</h6>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md="auto" id={styles.messageBoxMessage} key={props.posts.ID}>
                {props.posts.Message}
              </Col>
            </Card.Body>
          </Card>
          <div
            id={
              darkThemeEnabled
                ? styles.getRepliesLinkLightMode
                : styles.getRepliesLinkDarkMode
            }
          />
        </Modal.Body>
        {props.replies.map((post: any) => (
          <Modal.Body
            id={darkThemeEnabled ? null : styles.postDarkMode}
            style={{ paddingTop: "0" }}
            key={post.ID}
          >
            <Card
              id={darkThemeEnabled ? null : styles.postDarkMode}
              key={post.ID}
            >
              <Card.Body
                id={darkThemeEnabled ? null : styles.postDarkMode}
                style={{ padding: "10px" }}
                key={post.ID}
              >
                <Col>
                  <Row>
                    <Col md="auto" id={styles.messageBoxPhotoContainer}>
                      <Image
                        key={post.Username}
                        id={styles.messageBoxPhoto}
                        src={post.ProfilePhoto}
                        rounded
                      />
                    </Col>
                    <Col md="auto" id={styles.messageBoxUsername}>
                      <h5 key={0} id={styles.usernameText}>
                        {post.ScreenName}
                      </h5>
                      <h6 key={1} id={styles.usernameText}>
                        {post.Username}
                      </h6>
                    </Col>
                  </Row>
                </Col>
                <Col md="auto" id={styles.messageBoxMessage} key={post.ID}>
                  {post.Message}
                </Col>
              </Card.Body>
            </Card>
          </Modal.Body>
        ))}
      </Modal>
    </Col>
  )
}
