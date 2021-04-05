import styles from "../styles/components/Posts.module.scss"
import React, { useEffect, useState } from "react"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Image from "react-bootstrap/Image"
import {
  Arrow90degRight,
  ArrowRepeat,
  ChatLeftFill,
  SuitHeartFill,
  ThreeDots,
} from "react-bootstrap-icons"
import { useDispatch, useSelector } from "react-redux"
import axios, { AxiosResponse } from "axios"
import { getAccessToken } from "./accessToken"
import { NewReply } from "./newReply"
import { GetReplies } from "./getReplies"
import { useRouter } from "next/router"
import NavDropdown from "react-bootstrap/NavDropdown"
import { EditPost } from "./editPost"
import { DeletePost } from "./deletePost"

const Post = (props: any) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.userInfo.user)
  const darkThemeEnabled = useSelector((state: any) => state.userInfo.light)

  // Handle new user reply
  const [showNewReply, setShowNewReply] = useState(false)
  const handleCloseNewReply = () => setShowNewReply(false)
  const handleShowNewReply = () => {
    setShowNewReply(true)
  }

  // Handle editing post
  const [showEditPost, setShowEditPost] = useState(false)
  const handleCloseEditPost = () => setShowEditPost(false)
  const handleShowEditPost = () => {
    setShowEditPost(true)
  }

  // Handle deleting a post
  const [showDeletePost, setShowDeletePost] = useState(false)
  const handleCloseDeletePost = () => setShowDeletePost(false)
  const handleShowDeletePost = () => {
    setShowDeletePost(true)
  }

  // Handle showing replies
  const [showReplies, setShowReplies] = useState(false)
  const handleCloseReplies = () => setShowReplies(false)
  const handleShowReplies = () => {
    fetchReplies()
    setShowReplies(true)
  }
  const [getReplies, setGetReplies] = useState<AxiosResponse | null | void>(
    null
  )

  async function fetchReplies() {
    let response = await axios(
      "http://ec2-34-207-154-73.compute-1.amazonaws.com/api/getReplies",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAccessToken(),
        },
        method: "post",
        data: JSON.stringify({
          ID: props.post.ID,
          UserId: props.post.UserId,
        }),
      }
    )
    setGetReplies(response.data)
  }

  const onLiker = (post: any) => {
    axios("http://ec2-34-207-154-73.compute-1.amazonaws.com/api/likePost", {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
      method: "post",
      data: JSON.stringify({
        ID: post.ID,
      }),
    }).then((r) => {
      post.Likes = r.data.Likes
      dispatch({ type: "LIKE_POST", post })
    })
  }

  const onUnLiker = (post: any) => {
    axios("http://ec2-34-207-154-73.compute-1.amazonaws.com/api/unlikePost", {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
      method: "post",
      data: JSON.stringify({
        ID: post.ID,
      }),
    }).then((r) => {
      post.Likes = r.data.Likes
      dispatch({ type: "UNLIKE_POST", post })
    })
  }

  const profilePhoto = (post: any) => {
    router.push(post.Username)
  }

  let isCurrentUser
  isCurrentUser = router.query.id == user.Username

  return (
    <Col id={styles.messageBox} md="auto">
      <Card
        style={{
          marginBottom: "20px",
        }}
        id={darkThemeEnabled ? null : styles.postDarkMode}
      >
        <Card.Body style={{ padding: "10px" }} key={props.post.ID}>
          <Col>
            <Row>
              <Col md="auto" id={styles.messageBoxPhotoContainer}>
                <Image
                  onClick={() => {
                    profilePhoto(props.post)
                  }}
                  id={styles.messageBoxPhoto}
                  src={props.post.ProfilePhoto}
                  rounded
                />
              </Col>

              <Col id={styles.messageBoxUsername}>
                <h5 id={styles.usernameText}>{props.post.ScreenName}</h5>
                <h6 id={styles.usernameText}>{props.post.Username}</h6>
              </Col>
              <Col id={styles.messageBoxUsername} md="auto">
                {isCurrentUser || router.pathname === "/home" ? (
                  <NavDropdown
                    alignRight
                    style={{ padding: "0", margin: "0" }}
                    title={<ThreeDots id={styles.editPostIcon} />}
                    id="basic-nav-dropdown"
                    className={styles.postsNavDrop}
                  >
                    <NavDropdown.Item onClick={handleShowEditPost}>
                      Edit
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={handleShowDeletePost}>
                      Delete
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : null}
              </Col>
            </Row>
          </Col>
          <Col md="auto" id={styles.messageBoxMessage} key={props.post.ID}>
            {props.post.Message}
          </Col>
          <Row className="text-center">
            <Col id={styles.messageBoxCol}>
              <span style={{ padding: "0 10px 0 0", margin: "0" }}>
                {props.post.Likes}
              </span>
              <SuitHeartFill
                id={
                  props.liked
                    ? styles.messageBoxIconLiked
                    : styles.messageBoxIcon
                }
                size={24}
                onClick={
                  props.liked
                    ? () => onUnLiker(props.post)
                    : () => onLiker(props.post)
                }
              />
            </Col>
            <Col id={styles.messageBoxCol}>
              <span style={{ padding: "0 10px 0 0", margin: "0" }}>
                {props.post.RePosts}
              </span>
              <ArrowRepeat id={styles.messageBoxIcon} size={24} />
            </Col>
            <Col id={styles.messageBoxCol}>
              <ChatLeftFill
                onClick={handleShowReplies}
                id={styles.messageBoxIcon}
                size={24}
              />
            </Col>
            <Col id={styles.messageBoxCol}>
              <Arrow90degRight
                onClick={handleShowNewReply}
                id={styles.messageBoxIcon}
                size={24}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <NewReply
        setShow={setShowNewReply}
        show={showNewReply}
        handleShow={handleShowNewReply}
        handleClose={handleCloseNewReply}
        posts={props.post}
      />
      <EditPost
        setShow={setShowEditPost}
        show={showEditPost}
        handleShow={handleShowEditPost}
        handleClose={handleCloseEditPost}
        posts={props.post}
        reload={fetchReplies}
      />
      <DeletePost
        setShow={setShowDeletePost}
        show={showDeletePost}
        handleShow={handleShowDeletePost}
        handleClose={handleCloseDeletePost}
        posts={props.post}
      />
      <GetReplies
        setShowReplies={setShowReplies}
        showReplies={showReplies}
        handleShowReplies={handleShowReplies}
        handleCloseReplies={handleCloseReplies}
        posts={props.post}
        replies={getReplies}
      />
    </Col>
  )
}

export const Posts = () => {
  const posts = useSelector((state: any) => state.posts)
  const postsLikes = useSelector((state: any) => state.postsLikes)
  const auth = useSelector((state: any) => state.userInfo.authorized)
  const postsLikeCounters = useSelector((state: any) => state.postsLikeCounters)
  const user = useSelector((state: any) => state.userInfo.user)

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (router.query.id) {
      axios(
        "http://ec2-34-207-154-73.compute-1.amazonaws.com/api/users/" +
          router.query.id,
        {}
      ).then((r) => {
        dispatch({ type: "SET_POSTS", payload: r.data })
      })
    } else if (router.pathname === "/home") {
      axios(
        "http://ec2-34-207-154-73.compute-1.amazonaws.com/api/users/" +
          user.Username,
        {}
      ).then((r) => {
        dispatch({ type: "SET_POSTS", payload: r.data })
      })
    }
  }, [router.query.id])

  if (router.pathname === "/home" && !posts.posts) {
    return <div></div>
  }

  if (!auth && !posts.posts) {
    return (
      <div>
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          User does not exist
        </h1>
      </div>
    )
  } else if (!posts.posts) {
    return <div></div>
  }

  return (
    <div>
      <Col id={styles.messageBox} md="auto">
        {posts.posts.map((post: any) => (
          <Post
            key={post.ID}
            post={post}
            likes={postsLikeCounters[post.ID]}
            liked={postsLikes[post.ID]}
          />
        ))}
      </Col>
    </div>
  )
}
