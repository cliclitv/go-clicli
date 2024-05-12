package svc

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/cliclitv/go-clicli/db"
	"github.com/julienschmidt/httprouter"
)

func AddDanmaku(w http.ResponseWriter, r *http.Request, p httprouter.Params) {

	req, _ := ioutil.ReadAll(r.Body)
	body := &db.Danmaku{}

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
	if err := db.AddDanmaku(body.Content, body.Pid, body.P, user.Id, body.Pos, body.Color); err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendMsg(w, 200, "添加成功了")
	}

}

func GetDanmakus(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	pid, _ := strconv.Atoi(r.URL.Query().Get("pid"))
	p, _ := strconv.Atoi(r.URL.Query().Get("p"))
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))

	var resp []*db.Danmaku
	var err error

	resp, err = db.GetDanmakus(pid, p, page, pageSize)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		res := &db.Danmakus{Danmakus: resp}
		sendDanmakusResponse(w, res, 200)
	}
}

func DeleteDanmaku(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id, _ := strconv.Atoi(p.ByName("id"))
	_, err := Auth(
		r.URL.Query().Get("token"), 0b1100) // 审核权限

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}
	err = db.DeleteDanmaku(id)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendMsg(w, 200, "删除成功啦")
	}
}
