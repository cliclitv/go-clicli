package handler

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/cliclitv/go-clicli/db"
	"github.com/cliclitv/go-clicli/def"
	"github.com/cliclitv/go-clicli/util"
	"github.com/julienschmidt/httprouter"
	"github.com/nilslice/jwt"
)

const DOMAIN = "clicli.me"

func Register(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req, _ := ioutil.ReadAll(r.Body)
	ubody := &def.User{}

	if err := json.Unmarshal(req, ubody); err != nil {
		sendMsg(w, 401, "参数解析失败")
		return
	}

	if res, _ := db.GetUser(ubody.Name, 0, ""); res != nil {
		sendMsg(w, 401, "用户名已存在")
		return
	}

	if err := db.CreateUser(ubody.Name, ubody.Pwd, ubody.Level, ubody.QQ, ubody.Desc); err != nil {
		sendMsg(w, 500, "数据库错误")
		return
	} else {
		sendMsg(w, 200, "注册成功啦")
	}

}

func Login(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	req, _ := ioutil.ReadAll(r.Body)
	ubody := &def.User{}

	if err := json.Unmarshal(req, ubody); err != nil {
		sendMsg(w, 401, "参数解析失败")
		return
	}

	resp, err := db.GetUser(ubody.Name, 0, "")
	pwd := util.Cipher(ubody.Pwd)

	if err != nil || len(resp.Pwd) == 0 || pwd != resp.Pwd {
		sendMsg(w, 401, "用户名或密码错误")
		return
	} else {
		level := resp.Level
		q := resp.QQ
		n := resp.Name
		uu := resp.Id
		claims := map[string]interface{}{"exp": time.Now().Add(time.Hour).Unix(), "level": level, "qq": q, "name": n, "uid": uu}
		token, err := jwt.New(claims)
		if err != nil {
			return
		}

		res := &def.User{Id: resp.Id, Name: resp.Name, Level: resp.Level, QQ: resp.QQ, Desc: resp.Desc}
		resStr, _ := json.Marshal(struct {
			Code  int       `json:"code"`
			Token string    `json:"token"`
			User  *def.User `json:"user"`
		}{Code: 200, Token: token, User: res})

		t := http.Cookie{Name: "token", Value: token, Path: "/", MaxAge: 86400, Domain: DOMAIN}
		http.SetCookie(w, &t)
		qq := http.Cookie{Name: "uqq", Value: resp.QQ, Path: "/", MaxAge: 86400, Domain: DOMAIN}
		http.SetCookie(w, &qq)
		uid := http.Cookie{Name: "uid", Value: strconv.Itoa(resp.Id), Path: "/", MaxAge: 86400, Domain: DOMAIN}
		http.SetCookie(w, &uid)
		l := http.Cookie{Name: "level", Value: strconv.Itoa(resp.Level), Path: "/", MaxAge: 86400, Domain: DOMAIN}
		http.SetCookie(w, &l)

		io.WriteString(w, string(resStr))
	}

}

func Logout(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	i := http.Cookie{Name: "uid", Path: "/", Domain: DOMAIN, MaxAge: -1}
	q := http.Cookie{Name: "uqq", Path: "/", Domain: DOMAIN, MaxAge: -1}
	l := http.Cookie{Name: "level", Path: "/", Domain: DOMAIN, MaxAge: -1}
	t := http.Cookie{Name: "token", Path: "/", Domain: DOMAIN, MaxAge: -1}
	http.SetCookie(w, &i)
	http.SetCookie(w, &q)
	http.SetCookie(w, &t)
	http.SetCookie(w, &l)
	sendMsg(w, 200, "退出成功啦")
}

func UpdateUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	pint, _ := strconv.Atoi(p.ByName("id"))
	req, _ := ioutil.ReadAll(r.Body)
	ubody := &def.User{}
	if err := json.Unmarshal(req, ubody); err != nil {
		sendMsg(w, 200, "参数解析失败")
		return
	}

	old, _ := db.GetUser("", pint, "")

	if old.Name != ubody.Name {
		if res, _ := db.GetUser(ubody.Name, 0, ""); res != nil {
			sendMsg(w, 401, "用户名已存在~")
			return
		}
	}
	var realLevel int
	token := r.Header.Get("token")
	if jwt.Passes(token) {
		s := jwt.GetClaims(token)
		l := int(s["level"].(float64))
		if l < old.Level {
			sendMsg(w, 401, "权限不足")
			return
		} else {
			if l == 4 {
				realLevel = ubody.Level
			} else {
				realLevel = old.Level
			}
		}
	} else {
		sendMsg(w, 401, "token过期或无效")
		return
	}

	if resp, err := db.UpdateUser(pint, ubody.Name, ubody.Pwd, realLevel, ubody.QQ, ubody.Desc); err != nil {
		sendMsg(w, 500, "数据库错误")
		return
	} else {
		ret := &def.User{Id: resp.Id, Name: resp.Name, Level: resp.Level, QQ: resp.QQ, Desc: resp.Desc}
		sendUserResponse(w, ret, 200, "更新成功啦")
	}
}

func DeleteUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	if !AuthToken(w, r, 4) {
		return
	}
	uid, _ := strconv.Atoi(p.ByName("id"))
	err := db.DeleteUser(uid)
	if err != nil {
		sendMsg(w, 500, "数据库错误")
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
		log.Printf("%s", err)
		sendMsg(w, 500, "数据库错误")
		return
	}
	sendUserResponse(w, resp, 200, "")

}

func GetUsers(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	level, _ := strconv.Atoi(r.URL.Query().Get("level"))
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))

	resp, err := db.GetUsers(level, page, pageSize)
	if err != nil {
		sendMsg(w, 500, "数据库错误")
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
		sendMsg(w, 500, "数据库错误")
		return
	} else {
		res := &def.Users{Users: resp}
		sendUsersResponse(w, res, 200)
	}
}
