package handler

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/cliclitv/go-clicli/db"
	"github.com/cliclitv/go-clicli/def"
	"github.com/julienschmidt/httprouter"
)

func AddVideo(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	if !AuthToken(w, r, 2) {
		return
	}
	req, _ := ioutil.ReadAll(r.Body)
	body := &def.Video{}

	if err := json.Unmarshal(req, body); err != nil {
		sendMsg(w, 401, "参数解析失败")
		return
	}

	if resp, err := db.AddVideo(body.Oid, body.Title, body.Content, body.Pid, body.Uid); err != nil {
		sendMsg(w, 401, "数据库错误")
		return
	} else {
		sendVideoResponse(w, resp, 200)
	}

}

func UpdateVideo(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	if !AuthToken(w, r, 2) {
		return
	}
	id := p.ByName("id")
	vid, _ := strconv.Atoi(id)
	req, _ := ioutil.ReadAll(r.Body)
	body := &def.Video{}

	if err := json.Unmarshal(req, body); err != nil {
		sendMsg(w, 401, "参数解析失败")
		return
	}

	if resp, err := db.UpdateVideo(vid, body.Oid, body.Title, body.Content, body.Pid, body.Uid); err != nil {
		sendMsg(w, 401, "数据库错误")
		return
	} else {
		sendVideoResponse(w, resp, 200)
	}

}

func GetVideos(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	pid, _ := strconv.Atoi(r.URL.Query().Get("pid"))
	uid, _ := strconv.Atoi(r.URL.Query().Get("uid"))
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	if pageSize >= 150 {
		sendMsg(w, 401, "pageSize太大了")
		return
	}
	resp, err := db.GetVideos(pid, uid, page, pageSize)
	if err != nil {
		sendMsg(w, 401, "数据库错误")
		return
	} else {
		res := &def.Videos{Videos: resp}
		sendVideosResponse(w, res, 200)
	}
}

func GetVideo(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	vid, _ := strconv.Atoi(p.ByName("id"))
	resp, err := db.GetVideo(vid)
	if err != nil {
		sendMsg(w, 401, "数据库错误")
		return
	} else {
		sendVideoResponse(w, resp, 200)
	}
}

func DeleteVideo(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	if !AuthToken(w, r, 3) {
		return
	}
	id, _ := strconv.Atoi(r.URL.Query().Get("id"))
	pid, _ := strconv.Atoi(r.URL.Query().Get("pid"))

	err := db.DeleteVideo(id, pid)
	if err != nil {
		sendMsg(w, 401, "数据库错误")
		return
	} else {
		sendMsg(w, 200, "删除成功")
	}
}
