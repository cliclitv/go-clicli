package handler

import (
	"github.com/cliclitv/go-clicli/def"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"strings"
)

func GetPlay(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	play := r.URL.Query().Get("url")
	arr := strings.Split(play, "@")
	mtype := "mp4"

	if strings.Contains(arr[0], "m3u8") {
		mtype = "m3u8"
	}

	if arr[1] == "dogecloud"{
	 res := GetDoge(r, arr[0])
	
	sendMsg(w,200, string(res))
	return

	}

	url := arr[0]

	res := def.Play{MType:mtype,Url:url}
	sendPlayResponse(w, res, 200)

}
