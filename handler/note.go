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

func AddNote(w http.ResponseWriter, r *http.Request, p httprouter.Params) {

	req, _ := ioutil.ReadAll(r.Body)
	body := &db.Note{}

	if err := json.Unmarshal(req, body); err != nil {
		sendMsg(w, 401, fmt.Sprintf("%s", err))
		return
	}

	if resp, err := db.AddNote(body.Title, body.Content, body.Pid, body.Uid,body.Tag); err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendNoteResponse(w, resp, 200)
	}

}

func UpdateNote(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id := p.ByName("id")
	vid, _ := strconv.Atoi(id)
	req, _ := ioutil.ReadAll(r.Body)
	body := &db.Note{}

	if err := json.Unmarshal(req, body); err != nil {
		sendMsg(w, 401, "参数解析失败")
		return
	}

	if resp, err := db.UpdateNote(vid, body.Title, body.Content, body.Pid, body.Tag); err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendNoteResponse(w, resp, 200)
	}

}

func GetNotes(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	tag := r.URL.Query().Get("tag")
	pid, _ := strconv.Atoi(r.URL.Query().Get("pid"))
	uid, _ := strconv.Atoi(r.URL.Query().Get("uid"))
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	resp, err := db.GetNotes(pid, uid,tag,page, pageSize)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		res := &db.Notes{Notes: resp}
		sendNotesResponse(w, res, 200)
	}
}

func GetNote(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	vid, _ := strconv.Atoi(p.ByName("id"))
	resp, err := db.GetNote(vid)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendNoteResponse(w, resp, 200)
	}
}

// func GetNoteByOid(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
// 	pid, _ := strconv.Atoi(r.URL.Query().Get("pid"))
// 	oid, _ := strconv.Atoi(r.URL.Query().Get("oid"))
// 	resp, err := db.GetNoteByOid(pid,oid)
// 	if err != nil {
// 		sendMsg(w, 500, fmt.Sprintf("%s", err))
// 		return
// 	} else {
// 		sendNoteResponse(w, resp, 200)
// 	}
// }

func DeleteNote(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id, _ := strconv.Atoi(r.URL.Query().Get("id"))
	pid, _ := strconv.Atoi(r.URL.Query().Get("pid"))

	err := db.DeleteNote(id, pid)
	if err != nil {
		sendMsg(w, 401, "数据库错误")
		return
	} else {
		sendMsg(w, 200, "删除成功")
	}
}