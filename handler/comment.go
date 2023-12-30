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
	runame := r.URL.Query().Get("runame")
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))

	var resp []*db.Comment
	var err error

	if runame == "" {
		resp, err = db.GetComments(pid, runame, page, pageSize)
		resp = fillComments(resp)
	} else {
		resp, err = db.GetComments(pid, runame, page, pageSize)
		// 然后设置为已读
	}

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		res := &db.Comments{Comments: resp}
		sendCommentsResponse(w, res, 200)
	}
}

func ReadComments(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	runame := r.URL.Query().Get("runame")

	err := db.ReadComments(runame)

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendMsg(w, 200, fmt.Sprintf("%s", "成功啦"))
	}
}

func fillComments(data []*db.Comment) []*db.Comment {

	mapComment := make(map[int]*db.Comment, len(data))
	ret := []*db.Comment{}

	for _, c := range data {
		c.Replies = []*db.Comment{}
		if c.Rid == 0 {
			ret = append(ret, c)
		}
		mapComment[c.Id] = c
	}

	for _, c := range data {
		if c.Rid != 0 {
			parent := mapComment[c.Rid]
			c.Replies = []*db.Comment{}
			parent.Replies = append(parent.Replies, c)
		}
	}
	return ret
}
