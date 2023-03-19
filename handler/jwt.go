package handler

import (
	"errors"
	jwt "github.com/golang-jwt/jwt/v4"
	"time"
	"fmt"
	"github.com/cliclitv/go-clicli/db"
)

var Key = []byte("clicli")

type MyClaims struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Pwd   string `json:"pwd"`
	Level int    `json:"level"`
	jwt.StandardClaims
}

func GenToken(id int, name string, pwd string, level int) (string, error) {
	c := MyClaims{
		id,
		name,
		pwd,
		level,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 240).Unix(),
			Issuer:    "yisar",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	return token.SignedString(Key)
}

func ParseToken(str string) (*MyClaims, error) {
	token, err := jwt.ParseWithClaims(str, &MyClaims{}, func(t *jwt.Token) (interface{}, error) {
		return Key, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*MyClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}

func Auth(uid int, token string) error {
	userClaims, err := ParseToken(token)
	if err != nil {
		return err
	}

	if userClaims.Level < 2 {
		// 都要大于2
		return errors.New("没有权限");
	}
	// 查找当前用户
	user, err := db.GetUser("", uid, "")

	fmt.Println(userClaims.Name)

	if err != nil {
		return err
	}

	if user.Name == userClaims.Name {
		// 本人编辑，ok
		return nil
	}

	if userClaims.Level > user.Level {
		// 编辑者权限 > 作者权限
		return nil
	}

	return errors.New("权限不足")
}
