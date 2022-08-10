package handler

import (
	"encoding/json"
	"fmt"
	"github.com/cliclitv/go-clicli/db"
	"github.com/cliclitv/go-clicli/def"
	"github.com/cliclitv/go-clicli/util"
	"github.com/julienschmidt/httprouter"
	"io"
	"net/http"
	"strconv"
)

func Register(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req, _ := io.ReadAll(r.Body)
	ubody := &def.User{}

	if err := json.Unmarshal(req, ubody); err != nil {
		sendMsg(w, 400, "参数解析失败")
		return
	}

	res, _ := db.GetUser("", 0, ubody.QQ)
	if res != nil {
		sendMsg(w, 400, "QQ已存在")
		return
	}

	if err := db.CreateUser(ubody.Name, ubody.Pwd, 1, ubody.QQ, ubody.Desc, ubody.Hash); err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendMsg(w, 200, "注册成功啦")
	}

}

func Login(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req, _ := io.ReadAll(r.Body)
	ubody := &def.User{}

	if err := json.Unmarshal(req, ubody); err != nil {
		sendMsg(w, 400, "参数解析失败")
		return
	}

	resp, err := db.GetUser(ubody.Name, 0, "")
	pwd := util.Cipher(ubody.Pwd)

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}
	if len(resp.Pwd) == 0 || pwd != resp.Pwd {
		sendMsg(w, 400, "用户名或密码错误")
		return
	} else {
		token, _ := GenToken(resp.Name, resp.Pwd, resp.Level)

		res := &def.User{Id: resp.Id, Name: resp.Name, Level: resp.Level, QQ: resp.QQ, Desc: resp.Desc, Hash: resp.Hash}
		resStr, _ := json.Marshal(struct {
			Code  int       `json:"code"`
			Token string    `json:"token"`
			User  *def.User `json:"user"`
		}{Code: 200, Token: token, User: res})

		io.WriteString(w, string(resStr))
	}

}

func Logout(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	sendMsg(w, 200, "退出成功啦")
}

func UpdateUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	pint, _ := strconv.Atoi(p.ByName("id"))
	req, _ := io.ReadAll(r.Body)
	ubody := &def.User{}
	if err := json.Unmarshal(req, ubody); err != nil {
		sendMsg(w, 400, "参数解析失败")
		return
	}
	resp, _ := db.UpdateUser(pint, ubody.Name, ubody.Pwd, ubody.Level, ubody.QQ, ubody.Desc)
	sendUserResponse(w, resp, 200, "更新成功啦")

}

func DeleteUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {

	uid, _ := strconv.Atoi(p.ByName("id"))
	err := db.DeleteUser(uid)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendMsg(w, 200, "删除成功")
	}
}

func GetUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	uname := r.URL.Query().Get("uname")
	uqq := r.URL.Query().Get("uqq")
	uid, _ := strconv.Atoi(r.URL.Query().Get("uid"))
	resp, err := db.GetUser(uname, uid, uqq)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}
	res := &def.User{Id: resp.Id, Name: resp.Name, Level: resp.Level, QQ: resp.QQ, Desc: resp.Desc, Hash: resp.Hash}
	sendUserResponse(w, res, 200, "")

}

func GetUsers(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	level, _ := strconv.Atoi(r.URL.Query().Get("level"))
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))

	if pageSize > 100 {
		sendMsg(w, 401, "pageSize太大了")
		return
	}

	resp, err := db.GetUsers(level, page, pageSize)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		res := &def.Users{Users: resp}
		sendUsersResponse(w, res, 200)
	}
}

func SearchUsers(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	key := r.URL.Query().Get("key")

	resp, err := db.SearchUsers(key)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		res := &def.Users{Users: resp}
		sendUsersResponse(w, res, 200)
	}
}
