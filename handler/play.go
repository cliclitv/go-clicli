package handler

import (
	"github.com/julienschmidt/httprouter"
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

	if len(arr)>1 && arr[1] == "dogecloud"{
	 url = GetDoge(r, arr[0])
	 mtype = "m3u8"
	}

	res := Play{MType:mtype,Url:url}
	sendPlayResponse(w, res, 200)

}
