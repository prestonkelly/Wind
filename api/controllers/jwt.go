package controllers

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	guuid "github.com/google/uuid"
	"net/http"
	"os"
	"strings"
	"time"
)


type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUuid   string
	RefreshUuid  string
	AtExpires    int64
	RtExpires    int64
}


func CreateToken(userid string) (*TokenDetails, error) {
	td := &TokenDetails{}
	td.AtExpires = time.Now().Add(time.Minute * 15).Unix()
	td.AccessUuid = guuid.New().String()

	td.RtExpires = time.Now().Add(time.Hour * 24 * 7).Unix()
	td.RefreshUuid = guuid.New().String()


	var err error

	// Creates Access Token
	accessTokenClaims := jwt.MapClaims{
		"authorized": true,
		"access_uuid": td.AccessUuid,
		"user_id": userid,
		"exp": td.AtExpires,
	}
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	td.AccessToken, err = at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, err
	}


	// Creates Refresh Token
	refreshTokenClaims := jwt.MapClaims{
		"refresh_uuid": td.RefreshUuid,
		"user_id": userid,
		"exp": td.RtExpires,
	}
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)
	td.RefreshToken, err = rt.SignedString([]byte(os.Getenv("REFRESH_SECRET")))
	if err != nil {
		return nil, err
	}

	// Returns the token details ("td")
	return td, nil
}


func CreateAuth(userid string, td *TokenDetails) error {
	// Convert Unix to UTC
	at := time.Unix(td.AtExpires, 0)
	rt := time.Unix(td.RtExpires, 0)
	now := time.Now()

	// Set (key, value) pair for access and refresh token in redis database
	errAccess := client.Set(client.Context(), td.AccessUuid, userid, at.Sub(now)).Err()
	if errAccess != nil {
		return errAccess
	}
	errRefresh := client.Set(client.Context(), td.RefreshUuid, userid, rt.Sub(now)).Err()
	if errRefresh != nil {
		return errRefresh
	}
	return nil
}


func ExtractToken(r *http.Request) string {
	// Get token from auth header sent from frontend
	bearToken := r.Header.Get("Authorization")

	// Separate "Bearer" from auth header
	strArr := strings.Split(bearToken, " ")

	// If "Bearer" and "JWT-Token" separated return jwt-token
	if len(strArr) == 2 {
		return strArr[1]
	}

	// Return empty string, which throws error in VerifyToken func
	return ""
}


func VerifyToken(r *http.Request) (*jwt.Token, error) {
	tokenString := ExtractToken(r)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}

	return token, nil
}


func TokenValid(r *http.Request) error {
	token, err := VerifyToken(r)
	if err != nil {
		return err
	}

	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		return err
	}
	return nil
}


func TokenAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := TokenValid(c.Request)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			c.Abort()
			return
		}
		c.Next()
	}
}

type AccessDetails struct {
	AccessUuid string
	UserId   string
}


func ExtractTokenMetadata(r *http.Request) (*AccessDetails, error) {
	token, err := VerifyToken(r)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		accessUuid, ok := claims["access_uuid"].(string)
		if !ok {
			return nil, err
		}

		userId, ok := claims["user_id"].(string)
		if !ok {
			return nil, err
		}

		return &AccessDetails{
			AccessUuid: accessUuid,
			UserId:   userId,
		}, nil
	}
	return nil, err
}


func DeleteAuth(givenUuid string) (int64, error) {
	deleted, err := client.Del(client.Context(), givenUuid).Result()
	if err != nil {
		return 0, err
	}
	return deleted, nil
}


func FetchAuth(authD *AccessDetails) (string, error) {
	userID, err := client.Get(client.Context(), authD.AccessUuid).Result()
	if err != nil {
		return userID, err
	}
	return userID, nil
}


func Refresh(c *gin.Context) {

	// Get refresh_token cookie from client
	var refreshToken, _ = c.Cookie("refresh_token")

	// Verify the token
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		// Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("REFRESH_SECRET")), nil
	})

	// Token must have expired
	if err != nil {
		c.JSON(http.StatusUnauthorized, "Refresh token expired")
		return
	}

	// Check to see if token is valid
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		c.JSON(http.StatusUnauthorized, err)
		return
	}

	// Since token is valid, get the uuid:
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		refreshUuid, ok := claims["refresh_uuid"].(string)
		if !ok {
			c.JSON(http.StatusUnauthorized, err)
			return
		}

		userId, ok := claims["user_id"].(string)
		if !ok {
			c.JSON(http.StatusUnauthorized, "Error occurred")
			return
		}

		// Delete the previous Refresh Token
		deleted, delErr := DeleteAuth(refreshUuid)
		if delErr != nil || deleted == 0 {
			c.JSON(http.StatusUnauthorized, "unauthorized")
			return
		}

		// Create new pairs of refresh and access tokens
		ts, createErr := CreateToken(userId)
		if  createErr != nil {
			println(createErr.Error())
			c.JSON(http.StatusUnauthorized, createErr.Error())
			return
		}

		// Save the tokens metadata to redis
		saveErr := CreateAuth(userId, ts)
		if saveErr != nil {
			println(saveErr.Error())
			c.JSON(http.StatusUnauthorized, saveErr.Error())
			return
		}

		// Send client http only cookie
		c.SetCookie("refresh_token", ts.RefreshToken, 604800, "/", "ec2-34-207-154-73.compute-1.amazonaws.com", false, true)

		// Return access token which will be stored in memory
		c.JSON(http.StatusOK, ts.AccessToken)
	} else {
		c.JSON(http.StatusUnauthorized, "refresh expired")
	}
}