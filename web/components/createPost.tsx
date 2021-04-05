import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import styles from "../styles/components/CreatePost.module.scss"
import { Formik } from "formik"
import * as Yup from "yup"
import { getAccessToken } from "./accessToken"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"

interface initValuesType {
  message: string
}

const initialValues: initValuesType = {
  message: "",
}

const validationSchema = Yup.object().shape({
  message: Yup.string().max(255, "Message is too long"),
})

export const CreatePost = () => {
  const darkThemeEnabled = useSelector((state: any) => state.userInfo.light)
  const dispatch = useDispatch()
  async function fetchPosts() {
    let response = await axios(
      "http://ec2-34-207-154-73.compute-1.amazonaws.com/api/getTweets",
      {
        headers: {
          Authorization: "Bearer " + getAccessToken(),
        },
      }
    )
    dispatch({
      type: "SET_POSTS",
      payload: await response.data,
    })
  }

  const onSubmit = (values: initValuesType, actions: any) => {
    axios("http://ec2-34-207-154-73.compute-1.amazonaws.com/api/post", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAccessToken(),
      },
      method: "post",
      data: JSON.stringify({
        Message: values.message,
      }),
    }).then((r) => {
      if (r.status === 200) {
        actions.resetForm({
          message: "",
        })
        fetchPosts()
      }
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(props) => {
        const {
          values,
          errors,
          isSubmitting,
          handleSubmit,
          handleChange,
        } = props

        return (
          <Form noValidate onSubmit={handleSubmit}>
            <div style={{ position: "relative" }}>
              <Form.Control
                id={
                  darkThemeEnabled
                    ? styles.postSectionLight
                    : styles.postSectionDark
                }
                type="text"
                name="message"
                placeholder="What's happening?"
                onChange={handleChange}
                value={values.message}
                as="textarea"
                rows={3}
              />
              <Form.Control.Feedback type="invalid">
                {errors.message}
              </Form.Control.Feedback>
            </div>
            <Button
              id={
                darkThemeEnabled
                  ? styles.postButtonLight
                  : styles.postButtonDark
              }
              type="submit"
              block
            >
              {isSubmitting ? "Posting" : "Post"}
            </Button>
          </Form>
        )
      }}
    </Formik>
  )
}
