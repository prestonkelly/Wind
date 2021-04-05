import styles from "../styles/components/Header.module.scss"
import React from "react"
import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Button from "react-bootstrap/Button"
import Nav from "react-bootstrap/Nav"
import Link from "next/link"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import NavDropdown from "react-bootstrap/NavDropdown"
import { getAccessToken, setAccessToken } from "./accessToken"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"

const axiosInterceptors = () => {
  axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      if (getAccessToken()) {
        config.headers["Authorization"] = "Bearer " + getAccessToken()
      }
      return config
    },
    (error: any) => {
      return Promise.reject(error)
    }
  )

  axios.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      const originalRequest = error.config

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        return fetch(
          "http://ec2-34-207-154-73.compute-1.amazonaws.com/api/refresh",
          {
            method: "POST",
            headers: { Authorization: "Bearer " + getAccessToken() },
            credentials: "include",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setAccessToken(data)
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + getAccessToken()
            originalRequest.headers["Authorization"] =
              "Bearer " + getAccessToken()
            return axios(originalRequest)
          })
      }

      return Promise.reject(error)
    }
  )
}

export const MainHeader = () => {
  axiosInterceptors()
  const router = useRouter()
  const dispatch = useDispatch()
  const darkThemeEnabled = useSelector((state: any) => state.userInfo.light)
  const auth = useSelector((state: any) => state.userInfo.authorized)
  const user = useSelector((state: any) => state.userInfo.user)

  function settings() {
    axios("http://ec2-34-207-154-73.compute-1.amazonaws.com/api/account", {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
      method: "post",
    }).then((r: AxiosResponse) => {
      if (r.status == 200) {
        router.push("/settings")
      } else {
        router.push("/login")
      }
    })
  }

  function logOut() {
    axios("http://ec2-34-207-154-73.compute-1.amazonaws.com/api/logout", {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
      method: "post",
    }).then((r: AxiosResponse) => {
      if (r.status == 200) {
        dispatch({ type: "AUTHORIZED", payload: false })
        router.push("/login")
      }
    })
  }

  if (!auth) {
    router.push("/login")
  }

  function redirectUser() {
    router.push(user.Username)
  }

  return (
    <div id={darkThemeEnabled ? styles.homePageLight : styles.homePageDark}>
      {/* Styling for scrollbar color */}
      <style jsx global>{`
        body {
          background: ${darkThemeEnabled ? "white" : "#121212"};
        }
      `}</style>
      <Container id={styles.homePageContainer}>
        <Navbar expand="md">
          <Navbar.Brand
            id={
              darkThemeEnabled ? styles.headerFontLight : styles.headerFontDark
            }
            href="/home"
          >
            Wind
          </Navbar.Brand>

          <Navbar.Toggle
            id={darkThemeEnabled ? null : styles.darkNavToggle}
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <NavDropdown
                className="d-none d-md-block"
                alignRight
                title={user.Username}
                id={
                  darkThemeEnabled
                    ? styles.headerFontLight
                    : styles.headerFontDark
                }
              >
                <NavDropdown.Item onClick={redirectUser}>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={settings}>Settings</NavDropdown.Item>
                <NavDropdown.Item onClick={logOut}>Logout</NavDropdown.Item>
              </NavDropdown>
              <div className="d-block d-md-none">
                <NavDropdown.Item
                  id={
                    darkThemeEnabled
                      ? styles.headerFontLight
                      : styles.headerFontDark
                  }
                  onClick={redirectUser}
                >
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  id={
                    darkThemeEnabled
                      ? styles.headerFontLight
                      : styles.headerFontDark
                  }
                  onClick={settings}
                >
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Item
                  id={
                    darkThemeEnabled
                      ? styles.headerFontLight
                      : styles.headerFontDark
                  }
                  onClick={logOut}
                >
                  Logout
                </NavDropdown.Item>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </div>
  )
}

export const LoginRegisterHeader = () => {
  return (
    <div id={styles.loginPageDiv}>
      <Container>
        <Navbar expand="lg">
          <Link href="/">
            <Navbar.Brand href="/">Wind</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Link href="/login">
                <Nav.Link href="/login">
                  <Button variant="link" id={styles.loginButton}>
                    Login
                  </Button>
                </Nav.Link>
              </Link>
              <Link href="/register">
                <Nav.Link href="/register">
                  <Button variant="outline-dark" id={styles.signupButton}>
                    Sign Up
                  </Button>
                </Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </div>
  )
}
