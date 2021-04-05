import styles from "../styles/Home.module.scss"
import React from "react"
import Head from "next/head"
import { MainHeader } from "../components/header"
import Container from "react-bootstrap/Container"
import { useSelector } from "react-redux"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { CreatePost } from "../components/createPost"
import { LeftSideMenu } from "../components/leftSideMenu"
import { Posts } from "../components/posts"

export default function Home() {
  const darkThemeEnabled = useSelector((state: any) => state.userInfo.light)

  return (
    <div>
      <div id={darkThemeEnabled ? styles.light : styles.dark}>
        <Head>
          <title>Wind</title>
          <meta name="viewport" content="width=device-width" />
        </Head>
        <MainHeader />
        <Container id={styles.homeContainer}>
          <Row>
            <Col>
              <LeftSideMenu />
            </Col>
            <Col md={6}>
              <CreatePost />
              <Posts />
            </Col>
            <Col>
              <div></div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}
