package svc

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strconv"

	"github.com/cliclitv/go-clicli/db"
	"github.com/cliclitv/go-clicli/util"
	"github.com/julienschmidt/httprouter"
)

func IsNumber(str string) bool {

	pattern := "^[0-9]+$"

	match, err := regexp.MatchString(pattern, str)

	if err != nil {
		return false
	}

	return match

}

func Register(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	if !tb.TryConsume() {
		sendMsg(w, 429, "请求限速")
		return
	}
	req, _ := io.ReadAll(r.Body)
	ubody := &db.User{}

	if err := json.Unmarshal(req, ubody); err != nil {
		sendMsg(w, 400, fmt.Sprintf("%s", err))
		return
	}

	res, _ := db.GetUser("", 0, ubody.QQ)
	res2, _ := db.GetUser(ubody.Name, 0, "")
	if res != nil {
		sendMsg(w, 400, "QQ已存在")
		return
	}

	if res2 != nil {
		sendMsg(w, 400, "用户名已存在")
		return
	}

	if err := db.CreateUser(ubody.Name, ubody.Pwd, 1, ubody.QQ, ubody.Sign); err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		sendMsg(w, 200, "注册成功啦")
	}
}

func Login(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req, _ := io.ReadAll(r.Body)
	ubody := &db.User{}

	fmt.Println(ubody)

	if err := json.Unmarshal(req, ubody); err != nil {
		sendMsg(w, 400, fmt.Sprintf("%s", err))
		return
	}

	var resp *db.User
	var err error

	if IsNumber(ubody.Name) {
		// qq
		resp, err = db.GetUser("", 0, ubody.Name)
	} else {
		resp, err = db.GetUser(ubody.Name, 0, "")
	}

	pwd := util.Cipher(ubody.Pwd)

	if resp == nil || err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else if len(resp.Pwd) == 0 || pwd != resp.Pwd {
		sendMsg(w, 400, "用户名或密码错误")
		return
	} else {
		token, err := GenToken(resp.Id, resp.Name, resp.Pwd, resp.Level)
		if err != nil {
			fmt.Println(err)
			return
		}

		resStr, err := json.Marshal(struct {
			Code  int      `json:"code"`
			Token string   `json:"token"`
			User  *db.User `json:"user"`
		}{Code: 200, Token: token, User: resp})

		if err != nil {
			fmt.Println(err)
			return
		}

		io.WriteString(w, string(resStr))
	}

}

func Logout(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	sendMsg(w, 200, "退出成功啦")
}

func UpdateUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	uid, _ := strconv.Atoi(p.ByName("id"))
	req, _ := io.ReadAll(r.Body)
	ubody := &db.User{}
	if err := json.Unmarshal(req, ubody); err != nil {
		sendMsg(w, 400, "参数解析失败")
		return
	}

	token := r.Header.Get("token")

	user, err := ParseToken(token)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}

	var resp *db.User

	if user.Level&0b1000 != 0 {
		resp, _ = db.UpdateUser(uid, ubody.Name, ubody.Pwd, ubody.Level, ubody.QQ, ubody.Sign)
	} else if uid == user.Id {
		resp, _ = db.UpdateUser(uid, ubody.Name, ubody.Pwd, user.Level, ubody.QQ, ubody.Sign)
	} else {
		sendMsg(w, 500, "权限不足")
		return
	}

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
	if resp == nil || err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}
	res := &db.User{Id: resp.Id, Name: resp.Name, Level: resp.Level, QQ: resp.QQ, Sign: resp.Sign}
	sendUserResponse(w, res, 200, "")

}

func GetUsers(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	level, _ := strconv.Atoi(r.URL.Query().Get("level"))
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))

	resp, err := db.GetUsers(level, page, pageSize)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	} else {
		res := &db.Users{Users: resp}
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
		res := &db.Users{Users: resp}
		sendUsersResponse(w, res, 200)
	}
}
