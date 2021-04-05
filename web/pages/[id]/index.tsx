import React from "react"
import Head from "next/head"
import { MainHeader } from "../../components/header"
import Container from "react-bootstrap/Container"
import styles from "../../styles/Index.module.scss"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Posts } from "../../components/posts"
import { CreatePost } from "../../components/createPost"
import { ProfilePhotoMenu } from "../../components/profilePhotoMenu"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import { LeftSideMenu } from "../../components/leftSideMenu"

export default function Index() {
  const router = useRouter()
  const posts = useSelector((state: any) => state.posts)
  const user = useSelector((state: any) => state.userInfo.user.Username)
  const auth = useSelector((state: any) => state.userInfo.authorized)
  const signedInUser = user !== router.query.id

  return (
    <div>
      <Head>
        <title>Wind</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <MainHeader />
      <Container>
        <Row style={{ margin: "0 35px 0 35px" }}>
          <ProfilePhotoMenu />
          <Col md={6} id={styles.messagesContainer}>
            <Col md="auto" id={styles.messageSend}>
              {!auth || signedInUser ? <div /> : <CreatePost />}
            </Col>
            <Posts />
          </Col>
          <Col className="d-none d-lg-block" id={styles.messagesContainer}>
            <LeftSideMenu />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
