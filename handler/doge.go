package handler

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
	"io"
	"fmt"
	"crypto/hmac"
    "crypto/sha1"
    "encoding/hex"
	"net"
)

func DogeAuth(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	fname := r.URL.Query().Get("fname")
	rname := r.URL.Query().Get("rname")
	params := "/auth/upload.json?filename="+fname+"&vn="+rname
	data := Get(params)
	sendMsg(w, 200, data)
}

func Get(params string)string{
	token:= GetToken(params)
	req, err := http.NewRequest("GET","https://api.dogecloud.com"+params,nil)
	req.Header.Add("Authorization", token)
	req.Header.Add("Host", "api.dogecloud.com")
	client := http.Client{}
    res, err := client.Do(req)
	if err != nil {
		return ""
	}
	data, err := io.ReadAll(res.Body)
	res.Body.Close()
	if err != nil {
		return ""
	}
	// body, err := json.Marshal(data)
	return string(data)
}

func GetToken(params string) string{
	AccessKey := "6afaef332191f6f0"
    SecretKey := "3887995e8f1e165073324a551069ab2b"

	signStr := params + "\n" + ""

    hmacObj := hmac.New(sha1.New, []byte(SecretKey))
    hmacObj.Write([]byte(signStr))
    sign := hex.EncodeToString(hmacObj.Sum(nil))
    token := "TOKEN " + AccessKey + ":" + sign
	return token
}

func GetDoge(r *http.Request, vid string) string {
	ip:=getClientIp()
	params := "/video/streams.json?platform=pch5&vid="+vid+"&ip="+ip
	fmt.Printf(params)
	data:=Get(params)
	return data
}

func getClientIp() string {
	addrs, err := net.InterfaceAddrs()

	if err != nil {
		return ""
	}
	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return ""
}