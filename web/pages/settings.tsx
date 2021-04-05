import React from "react"
import Head from "next/head"
// import Footer from "../components/footer";
import { MainHeader } from "../components/header"
import { SettingsMenu } from "../components/settingsMenu"
import Container from "react-bootstrap/Container"
import styles from "../styles/Settings.module.scss"

export default function Settings() {
  return (
    <div>
      <Head>
        <title>Wind</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <MainHeader />
      <Container id={styles.settingContainer}>
        <div id={styles.settingDiv}>
          <SettingsMenu />
        </div>
      </Container>
    </div>
  )
}
