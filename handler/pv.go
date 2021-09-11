package handler

import (
	"net/http"
	"strconv"

	"github.com/cliclitv/go-clicli/db"
	"github.com/julienschmidt/httprouter"
)

func GetPv(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	pid, _ := strconv.Atoi(p.ByName("pid"))
	resp, err := db.GetPv(pid)
	if err != nil {
		sendMsg(w, 500, "数据库错误")
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
