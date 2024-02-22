package svc

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/cliclitv/go-clicli/db"
)

func sendUserResponse(w http.ResponseWriter, uRes *db.User, sc int, msg string) {
	w.WriteHeader(sc)

	resStr, _ := json.Marshal(struct {
		Code   int     `json:"code"`
		Msg    string  `json:"msg,omitempty"`
		Result db.User `json:"result"`
	}{sc, msg, *uRes})

	io.WriteString(w, string(resStr))

}

func sendPostResponse(w http.ResponseWriter, pRes *db.Post, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code   int      `json:"code"`
		Result *db.Post `json:"result"`
	}{sc, pRes})

	io.WriteString(w, string(resStr))
}

func sendPostsResponse(w http.ResponseWriter, pRes *db.Posts, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code int `json:"code"`
		*db.Posts
	}{sc, pRes})

	io.WriteString(w, string(resStr))
}

func sendUsersResponse(w http.ResponseWriter, pRes *db.Users, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code int `json:"code"`
		*db.Users
	}{sc, pRes})

	io.WriteString(w, string(resStr))
}

func sendPlayResponse(w http.ResponseWriter, cRes db.Play, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code   int     `json:"code"`
		Result db.Play `json:"result"`
	}{sc, cRes})

	io.WriteString(w, string(resStr))
}

func sendPvResponse(w http.ResponseWriter, cRes *db.Pv, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code   int    `json:"code"`
		Result *db.Pv `json:"result"`
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

func sendCommentsResponse(w http.ResponseWriter, Res *db.Comments, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code int `json:"code"`
		*db.Comments
	}{sc, Res})

	io.WriteString(w, string(resStr))
}

func sendCountResponse(w http.ResponseWriter, Res *db.Count, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code int `json:"code"`
		*db.Count
	}{sc, Res})

	io.WriteString(w, string(resStr))
}

func sendActionResponse(w http.ResponseWriter, Res *db.Action, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code int `json:"code"`
		*db.Action
	}{sc, Res})

	io.WriteString(w, string(resStr))
}
