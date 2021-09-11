package handler

import (
	_ "encoding/base64"
	"github.com/cliclitv/go-clicli/def"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"strings"
)

type WeGame struct {
	Result int `json:"result"`
}

type WeGameData struct {
	Result int `json:"result"`
}

//https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/3_306d67e46b610ae25aa4bbb773499c28.mp4
//https://rescdn.yishihui.com/longvideo/transcode/video/vpc/20200408/14775768rkbNjphhwIOWmfZiEN.m3u8?Expires=1586602797&OSSAccessKeyId=LTAIHZz0zdTMC7HN&Signature=ed8BOvQpS0vsbmJ8ReLnpQkwXBk%3D
//http://193.112.131.234:8081/play/typt.php?v=MTQtNzE0OTEyMjI2OTY5NzI2OQ==
//http://quan.qq.com/video//1098_1dfe90f805ee55e80d38d544ee99e3ea
//https://you-cdn.maque-zuida.com/20200127/Prlmi0qM/index.m3u8
//https://zm.ayypd.cn:83/index.php/m3u8/153151U7Pht2RDt8Cp7BjZlAL-BXDGUcqEy-LDvr2Q6_82_tvbyB9Jg6WGLUChhv9QC5bQiSPVkEAm8.m3u8

func Jx(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	url := r.URL.Query().Get("url")
	chunk := strings.Split(url, "@")
	content, tag := "", ""
	mtype := "mp4"

	content = chunk[0]
	if len(chunk) == 2 {
		tag = chunk[1]
		url = content
	}

	if strings.Contains(chunk[0], "m3u8") {
		mtype = "m3u8"
	}

	switch tag {
	case "hcy":
		//raw, _ := base64.StdEncoding.DecodeString(content)
		//case "1096":
		//	res, _ := http.Get("https://www.wegame.com.cn/api/forum/lua/wegame_feeds/get_feed_item_data?p={\"iid\":\"" + content + "\",\"uid\":211762212}")
		//	body, _ := ioutil.ReadAll(res.Body)
		//
		//	fmt.Println(string(body))
		//	break
	}

	//if strings.Contains(content, "1098") {
	//	resp, _ := http.Get(content)
	//	body, _ := ioutil.ReadAll(resp.Body)
	//	fmt.Println(string(body))
	//}

	sendRealVideoResult(w, 200, &def.RealVideo{Type: mtype, Url: url})
}
