import styles from "../styles/components/LeftSideMenu.module.scss"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrightnessHighFill, MoonStarsFill } from "react-bootstrap-icons"

export const LeftSideMenu = () => {
  const dispatch = useDispatch()
  const darkThemeEnabled = useSelector((state: any) => state.userInfo.light)

  return (
    <div id={styles.sticky}>
      <Card id={darkThemeEnabled ? styles.leftMenuLight : styles.leftMenuDark}>
        <Card.Body>
          <Button
            variant={darkThemeEnabled ? "dark" : "light"}
            onClick={() =>
              darkThemeEnabled
                ? dispatch({ type: "DARK_MODE" })
                : dispatch({ type: "LIGHT_MODE" })
            }
          >
            {darkThemeEnabled ? <MoonStarsFill /> : <BrightnessHighFill />}
          </Button>
        </Card.Body>
      </Card>
    </div>
  )
}
