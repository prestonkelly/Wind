import styles from "../styles/components/ProfilePhotoMenu.module.scss"
import Image from "react-bootstrap/Image"
import Col from "react-bootstrap/Col"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import Button from "react-bootstrap/Button"
import axios from "axios"

export const ProfilePhotoMenu = () => {
  let isCurrentUser
  const router = useRouter()
  const user = useSelector((state: any) => state.userInfo.user)
  const darkThemeEnabled = useSelector((state: any) => state.userInfo.light)
  const [userPhoto, setUserPhoto] = useState()

  isCurrentUser = router.query.id == user.Username

  useEffect(() => {
    if (router.query.id) {
      axios(
        "http://ec2-34-207-154-73.compute-1.amazonaws.com/api/userPhoto/" +
          router.query.id,
        {}
      ).then((r) => {
        setUserPhoto(r.data.ProfilePhoto)
      })
    }
  }, [router.query.id])

  return (
    <Col
      md="auto"
      id={
        darkThemeEnabled
          ? styles.profilePhotoColumnLight
          : styles.profilePhotoColumnDark
      }
    >
      <Image id={styles.profilePhoto} src={userPhoto} rounded fluid />
      <div>Followers {user.FollowerCount}</div>
      {!isCurrentUser ? (
        <Button variant={darkThemeEnabled ? "outline-dark" : "outline-light"}>
          Follow
        </Button>
      ) : null}
    </Col>
  )
}
