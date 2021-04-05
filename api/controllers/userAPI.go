package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	guuid "github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"strings"
)


func Register(c *gin.Context){

	// Error handling if anything but json is provided
	var users Users
	if err := c.ShouldBindJSON(&users); err != nil {
		c.JSON(http.StatusUnauthorized, "Invalid json provided")
		return
	}

	userEmail := &Users{
		Username: users.Username,
		Email: users.Email,
	}
	exists, _ := dbConnect.Model(userEmail).Where("username = ?", users.Username).WhereOr("email = ?", users.Email).Exists()

	// If username does not exist
	if !exists {

		// Encrypt users password
		crypPassword, _ := bcrypt.GenerateFromPassword([]byte(users.Password), 8)

		// Var for users id
		setUserId := guuid.New().String()

		// Create schema for user to be inserted into users table
		userInsert := &Users {
			UserId: setUserId,
			Username: strings.ToLower(users.Username),
			ScreenName: users.Username,
			Password: string(crypPassword),
			Email: users.Email,
			FollowerCount: 0,
			FriendCount: 0,
		}

		// Insert data into database using schema above
		_, err := dbConnect.Model(userInsert).Insert()
		if err != nil {
			log.Println(err)
		}

		// Respond to server with 200 status (OK)
		c.JSON(http.StatusOK, gin.H{
			"status": http.StatusOK,
		})

	} else {
		// Respond to client stating the username already exists
		c.JSON(http.StatusForbidden, gin.H{
			"status":  http.StatusUnauthorized,
			//"message": "Email already exists",
		})
	}
	return
}


func Login(c *gin.Context){
	// Error handling if anything but json is provided
	var user Users
	var posts []Posts
	var totalPosts []Posts
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusUnauthorized, "Invalid json provided")
		return
	}

	userCredentials := &Users{
		Username: strings.ToLower(user.Username),
	}

	// Check if username exists
	err := dbConnect.Model(userCredentials).Where("username = ?", userCredentials.Username).Select()
	if err != nil {
		log.Printf("Error while getting all todos, Reason: %v\n", err)
		c.JSON(http.StatusForbidden, gin.H{
			"status":  http.StatusUnauthorized,
			"message": "Something went wrong",
		})
		return
	}

	// Compare entered password with username db
	err = bcrypt.CompareHashAndPassword([]byte(userCredentials.Password), []byte(user.Password))
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  http.StatusUnauthorized,
			"message": "Something went wrong",
		})
		return
	}

	// Creates our access and refresh tokens
	token, err := CreateToken(userCredentials.UserId)
	if err != nil {
		fmt.Println("Error is :", err)
	}

	// Adds access and refresh token uuid to redis
	saveErr := CreateAuth(userCredentials.UserId, token)
	if saveErr != nil {
		c.JSON(http.StatusUnauthorized, saveErr.Error())
	}

	// Get users personal posts
	err = dbConnect.Model(&posts).Where("user_id = ?", userCredentials.UserId).Order("id DESC").Select()
	if err != nil {
		panic(err)
	}

	// Get user and users followers posts
	err = dbConnect.Model(&totalPosts).Where("user_id = ?", userCredentials.UserId).Order("id DESC").Select()
	if err != nil {
		panic(err)
	}

	// Set http only refresh cookie and send AccessToken for frontend to store in memory
	c.SetCookie("refresh_token", token.RefreshToken, 604800, "/", "ec2-34-207-154-73.compute-1.amazonaws.com", false, true)
	c.JSON(http.StatusOK, gin.H{
		"accessToken": token.AccessToken,
		"userInfo": userCredentials,
		"userPosts": posts,
	})

	return
}


func Logout(c *gin.Context) {
	au, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	deleted, delErr := DeleteAuth(au.AccessUuid)
	if delErr != nil || deleted == 0 {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	c.JSON(http.StatusOK, "Successfully logged out")
}