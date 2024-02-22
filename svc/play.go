package svc

import (
	"github.com/julienschmidt/httprouter"
	"github.com/cliclitv/go-clicli/db"
	"net/http"
	"strings"
)

func GetPlay(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	play := r.URL.Query().Get("url")
	arr := strings.Split(play, "@")
	mtype := "mp4"
	url := arr[0]

	if strings.Contains(arr[0], "m3u8") {
		mtype = "m3u8"
	}

	res := db.Play{MType:mtype,Url:url}
	sendPlayResponse(w, res, 200)

}
