import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import styles from "../styles/components/LoginMenu.module.scss"
import Link from "next/link"
import { Formik } from "formik"
import React from "react"
import { useRouter } from "next/router"
import * as Yup from "yup"
import { setAccessToken } from "./accessToken"
import { useDispatch } from "react-redux"

// Strict types for initial values
interface initValuesType {
  username: string
  password: string
  rememberMe: boolean
}

// Setting initial values for sign up form
const initValues: initValuesType = {
  username: "",
  password: "",
  rememberMe: false,
}

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Please enter your username")
    .min(4, "Please enter your username"),
  password: Yup.string()
    .required("Required")
    .min(8, "Required")
    .matches(/(?=.*[0-9])/, "Required"),
  rememberMe: Yup.bool(),
})

export const LoginMenu = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const onSubmit = (values: initValuesType, actions: any) => {
    actions.setSubmitting(true)

    fetch("http://ec2-34-207-154-73.compute-1.amazonaws.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        Username: values.username,
        Password: values.password,
        RememberMe: values.rememberMe,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status == 401) {
          actions.setFieldError("username", "Username or Password is incorrect")
          actions.setFieldError("password", " ")
        } else if (data.accessToken) {
          actions.setSubmitting(false)

          setAccessToken(data.accessToken)
          dispatch({ type: "AUTHORIZED", payload: true })
          dispatch({ type: "SET_USER", payload: data.userInfo })
          dispatch({ type: "SET_POSTS", payload: data.userPosts })
          router.push("/home")
        }
      })
  }

  return (
    <Formik
      initialValues={initValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props
        return (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={Boolean(touched.username && errors.username)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={Boolean(touched.password && errors.password)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Check
                  custom
                  type={"checkbox"}
                  id={`custom-${"checkbox"}`}
                  label="Remember me"
                  name="rememberMe"
                  onChange={handleChange}
                />
              </Form.Group>
              <Button
                variant="dark"
                type="submit"
                disabled={isSubmitting}
                block
              >
                {!isSubmitting ? "Login" : "Logging In..."}
              </Button>
              <Form.Row id={styles.registerRedirect}>
                <p>Need an account?</p>
                <p
                  style={{
                    paddingLeft: "10px",
                    paddingTop: "-10px",
                    textDecoration: "underline",
                  }}
                >
                  <Link href={"/register"}>Register</Link>
                </p>
              </Form.Row>
            </Form.Group>
          </Form>
        )
      }}
    </Formik>
  )
}
