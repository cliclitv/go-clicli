package svc

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/cliclitv/go-clicli/db"
	"github.com/cliclitv/go-clicli/util"
	"github.com/julienschmidt/httprouter"
)

var tb = util.NewTokenBucket(10, 20)

func AddComment(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	if !tb.TryConsume() {
		sendMsg(w, 429, "请求限速")
		return
	}
	req, _ := ioutil.ReadAll(r.Body)
	body := &db.Comment{}

	if err := json.Unmarshal(req, body); err != nil {
		sendMsg(w, 401, "参数解析失败")
		return
	}

	user, err := Auth(
		r.Header.Get("token"), 0b1111) // 非游客都可以

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}
	if _, err := db.AddComment(body.Content, body.Pid, user.Id, body.Rid, body.Runame); err != nil {
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

func UpdateCommentUv(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	cid := r.URL.Query().Get("cid")
	cidt, _ := strconv.Atoi(cid)
	name := r.URL.Query().Get("name")

	resp, err := db.GetComment(cidt)

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}
	uv := resp.Uv
	names := strings.Split(uv, ",")
	names = Remove(names, "") // 特殊处理，删除空字符串

	if strings.Contains(uv, name) {
		names = Remove(names, name)
	} else {
		names = append(names, name)
	} 

	var namestr = strings.Join(names, ",")

	err = db.UpdateCommentUv(cidt, namestr)

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
	} else {
		sendMsg(w, 200, namestr)
	}

}

func fillComments(data []*db.Comment) []*db.Comment {

	if len(data) == 0 {
		return []*db.Comment{}
	}

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
			if parent != nil {
				parent.Replies = append(parent.Replies, c)
			}

		}
	}
	return ret
}

func DeleteComment(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id, _ := strconv.Atoi(p.ByName("id"))
	_, err := Auth(
		r.URL.Query().Get("token"), 0b1100) // 审核权限

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}
	err = db.DeleteComment(id)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendMsg(w, 200, "删除成功啦")
	}
}
