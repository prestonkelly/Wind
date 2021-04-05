import styles from "../styles/Login.module.scss"
import React from "react"
import Head from "next/head"
import { LoginRegisterHeader } from "../components/header"
import { LoginMenu } from "../components/loginMenu"
// import Footer from "../components/footer";
import Container from "react-bootstrap/Container"

export default function Home() {
  return (
    <div>
      <Head>
        <title>Wind</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <LoginRegisterHeader />
      <Container id={styles.loginContainer}>
        <div id={styles.loginDiv}>
          <LoginMenu />
        </div>
      </Container>
    </div>
  )
}
