package handler

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"fmt"
	"github.com/cliclitv/go-clicli/db"
	"github.com/julienschmidt/httprouter"
)

func AddArticle(w http.ResponseWriter, r *http.Request, p httprouter.Params) {

	req, _ := ioutil.ReadAll(r.Body)
	body := &db.Article{}

	if err := json.Unmarshal(req, body); err != nil {
		sendMsg(w, 401, "参数解析失败")
		return
	}

	if resp, err := db.AddArticle(body.Oid, body.Title, body.Content, body.Pid, body.Bio); err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendArticleResponse(w, resp, 200)
	}

}

func UpdateArticle(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id := p.ByName("id")
	vid, _ := strconv.Atoi(id)
	req, _ := ioutil.ReadAll(r.Body)
	body := &db.Article{}

	if err := json.Unmarshal(req, body); err != nil {
		sendMsg(w, 401, "参数解析失败")
		return
	}

	if resp, err := db.UpdateArticle(vid, body.Oid, body.Title, body.Content, body.Pid, body.Bio); err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendArticleResponse(w, resp, 200)
	}

}

func GetArticles(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	pid, _ := strconv.Atoi(r.URL.Query().Get("pid"))
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	resp, err := db.GetArticles(pid, page, pageSize)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		res := &db.Articles{Articles: resp}
		sendArticlesResponse(w, res, 200)
	}
}

func GetArticle(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	vid, _ := strconv.Atoi(p.ByName("id"))
	resp, err := db.GetArticle(vid)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendArticleResponse(w, resp, 200)
	}
}

func DeleteArticle(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id, _ := strconv.Atoi(r.URL.Query().Get("id"))
	pid, _ := strconv.Atoi(r.URL.Query().Get("pid"))

	err := db.DeleteArticle(id, pid)
	if err != nil {
		sendMsg(w, 401, "数据库错误")
		return
	} else {
		sendMsg(w, 200, "删除成功")
	}
}