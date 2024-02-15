package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"github.com/cliclitv/go-clicli/db"
	"github.com/julienschmidt/httprouter"
)

func GetPv(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	pid, _ := strconv.Atoi(p.ByName("pid"))
	resp, err := db.GetPv(pid)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}
	if resp == nil {
		res, _ := db.ReplacePv(pid, 1)
		sendPvResponse(w, res, 200)

	} else {
		res, _ := db.ReplacePv(pid, resp.Pv+1)
		sendPvResponse(w, res, 200)
	}
}

func GetActionCount(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	action := r.URL.Query().Get("action")
	pid, _ := strconv.Atoi(r.URL.Query().Get("pid"))

	res, err := db.GetActionCount(action, pid, 0)

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
	}
	sendCountResponse(w, res, 200)
}

func ReplaceAction(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	action := r.URL.Query().Get("action")
	pid, _ := strconv.Atoi(r.URL.Query().Get("pid"))
	uid, _ := strconv.Atoi(r.URL.Query().Get("uid"))

	res, err := db.ReplaceAction(uid, action, pid)

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}
	fmt.Println(res,err)
	sendActionResponse(w, res, 200)
}
