package handler

import (
	"errors"
	jwt "github.com/golang-jwt/jwt/v4"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"strconv"
	"time"
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
			ExpiresAt: time.Now().Add(time.Hour * 5).Unix(),
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

func Auth(h httprouter.Handle, level int) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		// 首先判断是否本人
		id, _ := strconv.Atoi(p.ByName("id"))
		token := r.Header.Get("token")

		mc, err := ParseToken(token)

		if err != nil {
			sendMsg(w, 401, "token 失效")
		}

		if id == mc.Id {
			h(w, r, p)
		} else if mc.Level < level {
			sendMsg(w, 401, "权限不足")
		}

		h(w, r, p)

	}
}
