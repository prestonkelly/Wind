package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"wind/controllers"
)

func Routes(router *gin.Engine) {
	router.NoRoute(notFound)

	// Get posts
	router.GET("/api/getTweets", controllers.TokenAuthMiddleware(), controllers.GetAllTweets)
	router.GET("/api/users/:username", controllers.GetUserPosts)
	router.GET("/api/userPhoto/:username", controllers.GetUserPhoto)

	// Main post routes
	router.POST("/api/post", controllers.TokenAuthMiddleware(), controllers.CreatePost)
	router.POST("/api/likePost", controllers.TokenAuthMiddleware(), controllers.LikePost)
	router.POST("/api/unlikePost", controllers.TokenAuthMiddleware(), controllers.UnLikePost)
	router.PUT("/api/editPost", controllers.TokenAuthMiddleware(), controllers.EditPost)
	router.DELETE("/api/deletePost", controllers.TokenAuthMiddleware(), controllers.DeletePost)


	// Reply routes
	router.POST("/api/reply", controllers.TokenAuthMiddleware(), controllers.ReplyPost)
	router.POST("/api/getReplies", controllers.TokenAuthMiddleware(), controllers.GetAllReplies)

	// JWT, Login and Register
	router.POST("/api/register", controllers.Register)
	router.POST("/api/login", controllers.Login)
	router.POST("/api/logout", controllers.TokenAuthMiddleware(), controllers.Logout)
	router.POST("/api/account", controllers.TokenAuthMiddleware())
	router.POST("/api/refresh", controllers.Refresh)


	// S3 Bucket Upload
	router.PUT("/api/uploadPhoto", controllers.UploadPhoto)
	router.PUT("/api/updateSettings", controllers.TokenAuthMiddleware(), controllers.UserSettings)
}


func notFound(c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{
		"status":  404,
		"message": "Route Not Found",
	})
	return
}

