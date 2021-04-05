package controllers

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"time"
)


type Users struct {
	UserId 		  string `pg:",pk"`
	Username  	  string
	ScreenName    string
	Password  	  string
	Email 	  	  string
	CreatedAt 	  time.Time `pg:"default:now()"`
	FollowerCount int
	FriendCount   int
	ProfilePhoto  string
}

type Posts struct {
	ID    	  	  int `pg:",pk"`
	UserId 		  string
	Username 	  string
	ScreenName    string
	Message  	  string
	CreatedAt 	  time.Time `pg:"default:now()"`
	UpdatedAt 	  time.Time
	Likes		  int
	RePosts		  int
	ProfilePhoto  string
}

type Reply struct {
	ID    	  	  int `pg:",pk"`
	PostID   	  int
	UserId 		  string
	Username 	  string
	ScreenName    string
	Message 	  string
	CreatedAt 	  time.Time `pg:"default:now()"`
	UpdatedAt 	  time.Time
	Likes		  int
	RePosts		  int
	ProfilePhoto  string
}

func CreatePost(c *gin.Context) {
	var user Users
	var posts Posts
	if err := c.ShouldBindJSON(&posts); err != nil {
		c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
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

	err = dbConnect.Model(&user).Where("user_id = ?", userId).Select()
	if err != nil {
		log.Println(err)
	}

	//post.UserId = userId
	userPost := &Posts {
		UserId:     userId,
		Username:   user.Username,
		ScreenName: user.ScreenName,
		Message:    posts.Message,
		UpdatedAt:  time.Now(),
		ProfilePhoto: user.ProfilePhoto,
	}

	// Insert data into database using schema above
	_, err = dbConnect.Model(userPost).Insert()
	if err != nil {
		log.Println(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": http.StatusOK,
	})
}

func ReplyPost(c *gin.Context) {
	var reply Reply
	var user Users
	if err := c.ShouldBindJSON(&reply); err != nil {
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

	// Check if username exists
	err = dbConnect.Model(&user).Where("user_id = ?", userId).Order("user_id DESC").Select()
	if err != nil {
		panic(err)
	}

	userReply := &Reply {
		PostID: 	reply.ID,
		UserId:     userId,
		Username:	user.Username,
		ScreenName: user.ScreenName,
		Message:    reply.Message,
		UpdatedAt:  time.Now(),
		ProfilePhoto: user.ProfilePhoto,
	}

	// Insert data into database using schema above
	_, err = dbConnect.Model(userReply).Insert()
	if err != nil {
		log.Println(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": http.StatusOK,
	})
}

func GetAllReplies(c *gin.Context){
	var replies []Reply
	var posts Posts
	if err := c.ShouldBindJSON(&posts); err != nil {
		c.JSON(http.StatusUnauthorized, "Invalid json provided")
		return
	}

	err := dbConnect.Model(&replies).Where("post_id = ?", posts.ID).Order("id DESC").Select()
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, replies)
}


func LikePost(c *gin.Context) {
	var post Posts
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusForbidden, "Invalid json provided")
		return
	}

	postID := &Posts{
		ID:        post.ID,
		Likes: post.Likes + 1,
	}

	_, err := dbConnect.Model(&post).Set("likes = ?", postID.Likes).Where("ID = ?", postID.ID).Returning("Likes").Update()
	if err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, postID)
}

func UnLikePost(c *gin.Context) {
	var post Posts
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusForbidden, "Invalid json provided")
		return
	}

	postID := &Posts{
		ID:        post.ID,
		Likes: post.Likes,
	}

	_, err := dbConnect.Model(&post).Set("likes = ?", postID.Likes).Where("ID = ?", postID.ID).Returning("Likes").Update()
	if err != nil {
		panic(err)
	}
	c.JSON(http.StatusOK, postID)
}

func EditPost(c *gin.Context) {
	var post Posts
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusForbidden, "Invalid json provided")
		return
	}

	editedPost := &Posts{
		ID: post.ID,
		Message:   post.Message,
	}

	// Edit post and return new post
	_, err := dbConnect.Model(&post).Set("message = ?", editedPost.Message).Set("updated_at = ?", time.Now()).Where("ID = ?", editedPost.ID).Returning("*").Update()
	if err != nil {
		log.Printf("Error while getting all todos, Reason: %v\n", err)
		c.JSON(http.StatusForbidden, gin.H{
			"status":  http.StatusForbidden,
			"message": "Something went wrong",
		})
		return
	}

	c.JSON(http.StatusOK, editedPost)
}


func DeletePost(c *gin.Context) {
	var post Posts
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusForbidden, "Invalid json provided")
		return
	}

	editedPost := &Posts{
		ID: post.ID,
	}

	// Delete user
	_, err := dbConnect.Model(&post).Where("ID = ?", editedPost.ID).Delete()
	if err != nil {
		log.Printf("Error while getting all todos, Reason: %v\n", err)
		c.JSON(http.StatusForbidden, gin.H{
			"status":  http.StatusForbidden,
			"message": "Something went wrong",
		})
		return
	}

	c.JSON(http.StatusOK, editedPost.ID)
}

// CHANGE THIS TO SAY POSTS...............................................
func GetAllTweets(c *gin.Context) {
	var posts []Posts

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

	err = dbConnect.Model(&posts).Where("user_id = ?", userId).Order("id DESC").Select()
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, posts)
}

func GetUserPosts(c *gin.Context) {
	var posts []Posts
	Username := c.Param("username")

	err := dbConnect.Model(&posts).Where("username = ?", Username).Order("id DESC").Select()
	if err != nil {
		panic(err)
	}



	c.JSON(http.StatusOK, posts)
}

func GetUserPhoto(c *gin.Context) {
	var user Users
	Username := c.Param("username")
	println(Username)

	err := dbConnect.Model(&user).Column("profile_photo").Where("username = ?", Username).Select()
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, user)
}
