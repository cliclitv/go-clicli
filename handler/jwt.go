package handler

import (
	"time"
	jwt "github.com/golang-jwt/jwt/v4"
)

var Key = []byte("clicli.cc")

type MyClaims struct {
	name  string `json:"name"`
	pwd   string `json:"pwd"`
	level int    `json:"level"`
	jwt.StandardClaims
}

func GenToken(name string, pwd string, level int) (string, error) {
	c := MyClaims{
		name,
		pwd,
		level,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 5).Unix(),
			Issuer:    "yisar",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, c)
	return token.SignedString(Key)
}
