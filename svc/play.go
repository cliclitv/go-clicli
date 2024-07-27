package svc

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"github.com/cliclitv/go-clicli/db"
	"github.com/julienschmidt/httprouter"
)

func GetPlay(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	play := r.URL.Query().Get("url")
	arr := strings.Split(play, "@")
	mtype := "mp4"
	url := arr[0]

	if strings.Contains(arr[0], "m3u8") {
		mtype = "m3u8"
	}

	res := db.Play{MType: mtype, Url: url}
	sendPlayResponse(w, res, 200)

}
//兼容接口，未来会删除
func GetPv(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	type Pv struct {
		Pid int `json:"pid"`
		Pv  int `json:"pv"`
	}
	w.WriteHeader(200)
	res := Pv{Pid: 200, Pv: 100}
	resStr, _ := json.Marshal(struct {
		Code   int `json:"code"`
		Result Pv  `json:"result"`
	}{200, res})

	io.WriteString(w, string(resStr))
}
