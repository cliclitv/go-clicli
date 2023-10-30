package handler

import (
	"errors"
	"time"
	"github.com/cliclitv/go-clicli/db"
	jwt "github.com/golang-jwt/jwt/v4"
	"os"
)

var Key = []byte(os.Getenv("JWT_KEY"))

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

func Auth(uid int, token string, level int) error {
	userClaims, err := ParseToken(token)

	if err != nil {
		return errors.New("token已过期，请重新登录")
	}
	// 查找当前用户
	user, err := db.GetUser("", uid, "")

	if userClaims.Level < level {
		// 都要大于2
		return errors.New("没有权限")
	}

	if user.Name == userClaims.Name {
		// 本人编辑，ok
		return nil
	}

	if err != nil {
		return err
	}

	if level == 1 { // 编辑用户信息
		if userClaims.Level >= user.Level {
			// 编辑者权限 > 作者权限
			return nil
		}
	} else { // 编辑其它
		if userClaims.Level >= 3 {
			// 编辑者权限 > 作者权限
			return nil
		}
	}

	return errors.New("权限不足")
}
