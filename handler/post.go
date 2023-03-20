package handler

import (
	"encoding/json"
	"fmt"
	"github.com/cliclitv/go-clicli/db"
	"github.com/julienschmidt/httprouter"
	"io"
	"net/http"
	"strconv"
)

func AddPost(w http.ResponseWriter, r *http.Request, p httprouter.Params) {

	req, _ := io.ReadAll(r.Body)
	pbody := &db.Post{}

	if err := json.Unmarshal(req, pbody); err != nil {
		sendMsg(w, 400, fmt.Sprintf("%s", err))
		return
	}

	token := r.Header.Get("token")
	err := Auth(pbody.Uid, token) // uid 为原作者 uid

	if err!= nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}

	resp, err := db.AddPost(pbody.Title, pbody.Content, pbody.Status, pbody.Sort, pbody.Tag, pbody.Uid, pbody.Videos)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendPostResponse(w, resp, 200)
	}

}

func UpdatePost(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	pid := p.ByName("id")
	pint, _ := strconv.Atoi(pid)
	req, _ := io.ReadAll(r.Body)
	pbody := &db.Post{}
	if err := json.Unmarshal(req, pbody); err != nil {
		sendMsg(w, 400, fmt.Sprintf("%s", err))
		return
	}

	token := r.Header.Get("token")
	err := Auth(pbody.Uid, token) // uid 为原作者 uid

	if err!= nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}

	if resp, err := db.UpdatePost(pint, pbody.Title, pbody.Content, pbody.Status, pbody.Sort, pbody.Tag, pbody.Time, pbody.Videos); err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendPostResponse(w, resp, 200)
	}

}

func DeletePost(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	pid, _ := strconv.Atoi(p.ByName("id"))
	err := db.DeletePost(pid)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendMsg(w, 200, "删除成功啦")
	}
}

func GetPost(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	pid, _ := strconv.Atoi(p.ByName("id"))
	resp, err := db.GetPost(pid)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendPostResponse(w, resp, 200)
	}
}

func GetPosts(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	status := r.URL.Query().Get("status")
	sort := r.URL.Query().Get("sort")
	tag := r.URL.Query().Get("tag")
	uid, _ := strconv.Atoi(r.URL.Query().Get("uid"))
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))

	resp, err := db.GetPosts(page, pageSize, status, sort, tag, uid)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		res := &db.Posts{Posts: resp}
		sendPostsResponse(w, res, 200)
	}
}

func SearchPosts(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	key := r.URL.Query().Get("key")

	resp, err := db.SearchPosts(key)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		res := &db.Posts{Posts: resp}
		sendPostsResponse(w, res, 200)
	}

}

func GetRank(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	resp, err := db.GetRank()
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		res := &db.Posts{Posts: resp}
		sendPostsResponse(w, res, 200)
	}

}
