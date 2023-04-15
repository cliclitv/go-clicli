package handler

import (
	"github.com/cliclitv/go-clicli/db"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"strconv"
	"encoding/json"
	"fmt"
	"io"
)

func Follow(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	req, _ := io.ReadAll(r.Body)
	ubody := &Fstruct{}

	if err := json.Unmarshal(req, ubody); err != nil {
		sendMsg(w, 400, fmt.Sprintf("%s", err))
		return
	}

	if ubody.From == ubody.To {
		sendMsg(w, 500, "自己不能关注自己")
		return
	}

	// 先查询状态
	count,err := db.CheckFans(ubody.From, ubody.To)

	
	if err!= nil{
		sendMsg(w, 500, fmt.Sprintf("%s", err))
	}

	if count == 0 {
		// 两个人没有关系
		_, err:= db.Follow(ubody.From, ubody.To)
		
		if err!= nil{
			sendMsg(w, 500, fmt.Sprintf("%s", err))
		}
	}else{
		err:= db.Unfollow(ubody.From, ubody.To)
		
		if err!= nil{
			sendMsg(w, 500, fmt.Sprintf("%s", err))
		}
	}
	sendMsg(w, 200, fmt.Sprintf("%s", count))

}

func GetFanCount(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	uid, _ := strconv.Atoi(p.ByName("uid"))
	
	res, err := db.GetFanCount(uid)

	if err != nil{
		sendMsg(w, 500, fmt.Sprintf("%s", err))
	}
	
	sendFansResponse(w, res, 200)

}