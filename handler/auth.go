package handler

import (
	auth "github.com/nilslice/jwt"
	"net/http"
	"encoding/json"
	"io"
	"log"
	"github.com/julienschmidt/httprouter"
)

func Auth(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	t, err := r.Cookie("token")
	if err != nil {
		resStr, _ := json.Marshal(struct {
			Code int    `json:"code"`
			Msg  string `json:"msg"`
		}{Code: 401, Msg: "鉴权失败，请重新登陆"})

		io.WriteString(w, string(resStr))
		return
	} else {
		token := t.Value
		resStr, _ := json.Marshal(struct {
			Token string `json:"token"`
		}{Token: token})
		io.WriteString(w, string(resStr))
	}
}

func AuthToken(w http.ResponseWriter, r *http.Request, level int) bool {
	log.Printf("%d", level)
	token := r.Header.Get("token")
	log.Printf("%s", token)
	if auth.Passes(token) {
		s := auth.GetClaims(token)
		log.Printf("%s", s)
		log.Printf("%s", s["name"])
		log.Printf("%s", s["qq"])
		if int(s["level"].(float64)) < level {
			sendMsg(w, 401, "权限不足")
			return false
		}
		return true
	} else {
		sendMsg(w, 401, "token过期或无效")
		return false
	}

}
