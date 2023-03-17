package handler

import (
	"github.com/cliclitv/go-clicli/db"
	"github.com/julienschmidt/httprouter"
	"net/http"
	// "strconv"
	"encoding/json"
	"fmt"
	"io"
)

type Fstruct struct  {
	From  int `json:"from"`
	To int `json:"to"`
}

func GetPea(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	req, _ := io.ReadAll(r.Body)
	ubody := &Fstruct{}

	if err := json.Unmarshal(req, ubody); err != nil {
		sendMsg(w, 400, fmt.Sprintf("%s", err))
		return
	}

	from, err := db.GetPea(ubody.From)
	to, err2 := db.GetPea(ubody.To)
	if err != nil || err2 != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}

	if from == nil {
		db.ReplacePea(ubody.From,0)
	}

	if to == nil{
		db.ReplacePea(ubody.To,0)
	}

	if from.Pea < 1 {
		sendMsg(w, 500, fmt.Sprintf("%s", "弯豆不足"))
		return
	} else {
		db.ReplacePea(ubody.From,from.Pea-1)
		db.ReplacePea(ubody.To,to.Pea+1)
		sendMsg(w, 200, fmt.Sprintf("%s", "投币成功"))
	}
}