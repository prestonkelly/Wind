package controllers

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/go-pg/pg/v10"
	"github.com/go-redis/redis/v8"
	"os"
)

// Connect to redis
var  client *redis.Client

func init() {
	client = redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_HOST"),
	})

	check, err := client.Ping(client.Context()).Result()
	if err != nil {
		panic(err)
	}
	println(check)
}


// Connect to PostgreSQL, create global var
var dbConnect *pg.DB
func InitiateDB(db *pg.DB)  {
	dbConnect = db
}

func PostgreSQLConnect() *pg.DB {
	opts := &pg.Options{
		User: os.Getenv("AWS_PG_USERNAME"),
		Password: os.Getenv("AWS_PG_PASSWORD"),
		Addr: os.Getenv("AWS_PG_ADDR"),
		Database: os.Getenv("AWS_PG_DATABASE"),
	}

	var db = pg.Connect(opts)

	InitiateDB(db)
	return db
}


func S3BucketConnect() *session.Session {
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(os.Getenv("AWS_REGION")),
	})
	if err != nil  {
		panic(err)
	}

	return sess
}

