package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"time"
	db "wind/controllers"
	routes "wind/routes"
)


func main() {
	// Load variables from .env file
	err := godotenv.Load()
	if err != nil {
		println(err)
	}

	// Connect to postgresql database
	db.PostgreSQLConnect()

	//Connect to AWS S3 Bucket
	db.S3BucketConnect()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:3001"},
		AllowMethods:     []string{"POST", "GET", "PUT", "DELETE"},
		AllowHeaders:     []string{"authorization", "Content-Type", "X-Requested-With", "User-Agent"},
		ExposeHeaders:    []string{"Content-Range", "Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool { return true },
		MaxAge: 12 * time.Hour,
	}))

	routes.Routes(router)

	log.Fatal(router.Run(":3001"))
}
