package handler

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/cliclitv/go-clicli/db"
	"github.com/julienschmidt/httprouter"
)

func AddComment(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	req, _ := ioutil.ReadAll(r.Body)
	body := &db.Comment{}

	if err := json.Unmarshal(req, body); err != nil {
		sendMsg(w, 401, "参数解析失败")
		return
	}

	if _, err := db.AddComment(body.Content, body.Pid, body.Uid, body.Rid, body.Runame, 0); err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendMsg(w, 200, "添加成功了")
	}

}

func GetComments(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	pid, _ := strconv.Atoi(r.URL.Query().Get("pid"))
	ruid, _ := strconv.Atoi(r.URL.Query().Get("ruid"))
	rid, _ := strconv.Atoi(r.URL.Query().Get("rid"))
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))

	var resp []*db.Comment
	var err error

	resp, err = db.GetComments(pid, ruid, rid, page, pageSize)
	

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		res := &db.Comments{Comments: resp}
		sendCommentsResponse(w, res, 200)
	}
}
