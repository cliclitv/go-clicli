package handler

import (
	"encoding/json"
	"github.com/cliclitv/go-clicli/def"
	"io"
	"net/http"
)

func sendUserResponse(w http.ResponseWriter, uRes *def.User, sc int, msg string) {
	w.WriteHeader(sc)

	resStr, _ := json.Marshal(struct {
		Code   int      `json:"code"`
		Msg    string   `json:"msg,omitempty"`
		Result def.User `json:"result"`
	}{sc, msg, *uRes})

	io.WriteString(w, string(resStr))

}

func sendPostResponse(w http.ResponseWriter, pRes *def.Post, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code   int       `json:"code"`
		Result *def.Post `json:"result"`
	}{sc, pRes})

	io.WriteString(w, string(resStr))
}

func sendPostsResponse(w http.ResponseWriter, pRes *def.Posts, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code int `json:"code"`
		*def.Posts
	}{sc, pRes})

	io.WriteString(w, string(resStr))
}

func sendUsersResponse(w http.ResponseWriter, pRes *def.Users, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code int `json:"code"`
		*def.Users
	}{sc, pRes})

	io.WriteString(w, string(resStr))
}

func sendVideoResponse(w http.ResponseWriter, Res *def.Video, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code   int        `json:"code"`
		Result *def.Video `json:"result"`
	}{sc, Res})

	io.WriteString(w, string(resStr))
}

func sendVideosResponse(w http.ResponseWriter, Res *def.Videos, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code int `json:"code"`
		*def.Videos
	}{sc, Res})

	io.WriteString(w, string(resStr))
}

func sendCookieResponse(w http.ResponseWriter, cRes def.Cookie, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code   int        `json:"code"`
		Result def.Cookie `json:"result"`
	}{sc, cRes})

	io.WriteString(w, string(resStr))
}

func sendPvResponse(w http.ResponseWriter, cRes *def.Pv, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code   int     `json:"code"`
		Result *def.Pv `json:"result"`
	}{sc, cRes})

	io.WriteString(w, string(resStr))
}

func sendMsg(w http.ResponseWriter, code int, msg string) {
	w.WriteHeader(code)
	resStr, _ := json.Marshal(struct {
		Code int    `json:"code"`
		Msg  string `json:"msg"`
	}{Code: code, Msg: msg})

	io.WriteString(w, string(resStr))
}

func sendResult(w http.ResponseWriter, code int, res string) {
	w.WriteHeader(200)
	resStr, _ := json.Marshal(struct {
		Code   int    `json:"code"`
		Result string `json:"result"`
	}{Code: 200, Result: res})
	io.WriteString(w, string(resStr))
}

func sendRealVideoResult(w http.ResponseWriter, code int, res *def.RealVideo) {
	w.WriteHeader(200)
	resStr, _ := json.Marshal(struct {
		Code   int            `json:"code"`
		Result *def.RealVideo `json:"result"`
	}{Code: 200, Result: res})
	io.WriteString(w, string(resStr))
}
