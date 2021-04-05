package controllers

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"strings"
)


func UploadPhoto(c *gin.Context) {
	var users Users
	var posts Posts
	var reply Reply

	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	sess := S3BucketConnect()

	// Create S3 service client
	svc := s3.New(sess)

	file, header, err := c.Request.FormFile("photo")
	if err != nil {
		panic(err)
	}
	filename := "userProfilePhoto/" + userId + "/" + header.Filename

	_, err = svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(os.Getenv("AWS_BUCKET_NAME")),
		Key:    aws.String(filename),
		Body:   file,
	})
	if err != nil {
		panic(err)
	}

	filepath := "https://" + os.Getenv("AWS_BUCKET_NAME") + ".s3.amazonaws.com/" + filename

	// Update users photo in users profile data
	_, err = dbConnect.Model(&users).Set("profile_photo = ?", filepath).Where("user_id = ?", userId).Update()
	if err != nil {
		panic(err)
	}

	// Update users photo in posts
	_, err = dbConnect.Model(&posts).Set("profile_photo = ?", filepath).Where("user_id = ?", userId).Update()
	if err != nil {
		panic(err)
	}

	// Update users photo in replies
	_, err = dbConnect.Model(&reply).Set("profile_photo = ?", filepath).Where("user_id = ?", userId).Update()
	if err != nil {
		panic(err)
	}


	c.JSON(http.StatusOK, gin.H{
		"filepath":    filepath,
	})
	return
}

func UserSettings(c *gin.Context) {
	var user Users
	var posts Posts
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusUnauthorized, "Invalid json provided")
		return
	}

	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	userUpdate := &Users {
		Username: strings.ToLower(user.Username),
		ScreenName: user.ScreenName,
		Email: user.Email,
	}

	_, err = dbConnect.Model(userUpdate).Set("username = ?", userUpdate.Username).Set("screen_name = ?", userUpdate.ScreenName).Set("email = ?", userUpdate.Email).Where("user_id = ?", userId).Returning("*").Update()
	if err != nil {
		log.Println(err)
	}

	_, err = dbConnect.Model(&posts).Set("username = ?", userUpdate.Username).Set("screen_name = ?", userUpdate.ScreenName).Where("user_id = ?", userId).Returning("*").Update()
	if err != nil {
		log.Println(err)
	}


	c.JSON(http.StatusOK, userUpdate)
	return
}
