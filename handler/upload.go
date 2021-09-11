package handler

import (
	"encoding/json"
	"fmt"
	"html"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"
)

func UploadFile(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	err := r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, strings.SplitAfter(err.Error(), ":")[1], 500)
		return
	}
	defer file.Close()

	prefix := "./upload/" + time.Now().Format("2006/01/02") + "/"
	_, err = os.Stat(prefix)

	if os.IsNotExist(err) {
		os.MkdirAll(prefix, 0666)
	}

	name := strings.Split(handler.Filename, ".")
	f, err := os.OpenFile(
		prefix+html.UnescapeString(name[0])+"-"+strconv.FormatInt(time.Now().Unix(), 10)+"."+name[1],
		os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()
	if _, err := io.Copy(f, file); err == nil {
		w.WriteHeader(200)
		resStr, _ := json.Marshal(struct {
			Code   int    `json:"code"`
			Result string `json:"result"`
		}{Code: 200, Result: f.Name()})
		_, err := io.WriteString(w, string(resStr))
		if err != nil {
			http.Error(w, strings.SplitAfter(err.Error(), ":")[1], 500)
		}
	}
}
