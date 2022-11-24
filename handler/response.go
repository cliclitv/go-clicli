package handler

import (
	"encoding/json"
	"io"
	"net/http"
)

func sendUserResponse(w http.ResponseWriter, uRes *User, sc int, msg string) {
	w.WriteHeader(sc)

	resStr, _ := json.Marshal(struct {
		Code   int      `json:"code"`
		Msg    string   `json:"msg,omitempty"`
		Result User `json:"result"`
	}{sc, msg, *uRes})

	io.WriteString(w, string(resStr))

}

func sendPostResponse(w http.ResponseWriter, pRes *Post, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code   int       `json:"code"`
		Result *Post `json:"result"`
	}{sc, pRes})

	io.WriteString(w, string(resStr))
}

func sendPostsResponse(w http.ResponseWriter, pRes *Posts, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code int `json:"code"`
		*Posts
	}{sc, pRes})

	io.WriteString(w, string(resStr))
}

func sendUsersResponse(w http.ResponseWriter, pRes *Users, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code int `json:"code"`
		*Users
	}{sc, pRes})

	io.WriteString(w, string(resStr))
}

func sendPlayResponse(w http.ResponseWriter, cRes Play, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code   int      `json:"code"`
		Result Play `json:"result"`
	}{sc, cRes})

	io.WriteString(w, string(resStr))
}

func sendPvResponse(w http.ResponseWriter, cRes *Pv, sc int) {
	w.WriteHeader(sc)
	resStr, _ := json.Marshal(struct {
		Code   int     `json:"code"`
		Result *Pv `json:"result"`
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
