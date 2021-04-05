import styles from "../styles/Register.module.scss"
import React from "react"
import Head from "next/head"
import { LoginRegisterHeader } from "../components/header"
// import Footer from "../components/footer";
import Link from "next/link"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { Formik } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/router"

// Strict types for initial values
interface initValuesType {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

// Setting initial values for sign up form
const initValues: initValuesType = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
}

// Schema for formik validation
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Please enter your name"),
  username: Yup.string()
    .required("Please enter a username")
    .min(4, "Username is too short - should be 4 characters minimum")
    .max(25, "Username is too long - should be less than 25 characters"),
  email: Yup.string()
    .email("Must be a valid email")
    .required("Required")
    .max(255, "Email is too long"),
  password: Yup.string()
    .required("Required")
    .min(8, "Password is too short - should be 8 characters minimum")
    .matches(/(?=.*[0-9])/, "Password must contain a number"),
  confirmPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords do not match"),
})

export default function SignUpForm() {
  const router = useRouter()

  // Handle on submit
  const onSubmit = (values: initValuesType, actions: any) => {
    actions.setSubmitting(true)

    fetch("http://ec2-34-207-154-73.compute-1.amazonaws.com/api/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        Username: values.username,
        Password: values.password,
        Email: values.email,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data)
        if (data.status == 401) {
          actions.setSubmitting(false)
          actions.setFieldError("email", "Email or Username already exists")
          actions.setFieldError("username", "Email or Username already exists")
        } else if (data) {
          // REDIRECT USERS TO WAITING PAGE TIL THEY CONFIRM WITH THEIR EMAIL
          router.push("/login")
          actions.setSubmitting(false)
        } else {
          actions.setSubmitting(false)
          actions.setFieldError("email", "Server error")
        }
      })
  }

  return (
    <div>
      <Head>
        <title>Wind</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <LoginRegisterHeader />

      <Container id={styles.registerContainer}>
        <div id={styles.registerDiv}>
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
                        name="name"
                        placeholder="Full Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.name && !errors.name}
                        isInvalid={Boolean(touched.name && errors.name)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                      <Form.Control
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.username && !errors.username}
                        isInvalid={Boolean(touched.username && errors.username)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={values.email || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.email && !errors.email}
                        isInvalid={Boolean(touched.email && errors.email)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
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
                        isValid={touched.password && !errors.password}
                        isInvalid={Boolean(touched.password && errors.password)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Password (confirm)"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={
                          touched.confirmPassword && !errors.confirmPassword
                        }
                        isInvalid={Boolean(
                          touched.confirmPassword && errors.confirmPassword
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Row>
                      <p>
                        By signing up, you acknowledge that you've read and
                        agree to our{" "}
                        <a style={{ textDecoration: "underline" }}>
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a style={{ textDecoration: "underline" }}>
                          Privacy Statement.
                        </a>
                      </p>
                    </Form.Row>
                    <Button
                      variant="dark"
                      type="submit"
                      disabled={isSubmitting}
                      block
                    >
                      {!isSubmitting ? "Register" : "Registering..."}
                    </Button>
                    <Form.Row id={styles.signInPage}>
                      <p>Already have an account?</p>
                      <p
                        style={{
                          paddingLeft: "10px",
                          textDecoration: "underline",
                        }}
                      >
                        <Link href={"/login"}>Sign In</Link>
                      </p>
                    </Form.Row>
                  </Form.Group>
                </Form>
              )
            }}
          </Formik>
        </div>
      </Container>
    </div>
  )
}
