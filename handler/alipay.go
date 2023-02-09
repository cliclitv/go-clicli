package handler

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"errors"
	"fmt"
	"github.com/cliclitv/go-clicli/db"
	"github.com/julienschmidt/httprouter"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

var publickey string = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApmDKNmbEQSBaijjZCX1tfPZtFD4MTnnNDuDQEeB3uNA48Qk4KmrMAo3LDDqvFTQ7MHLJcHzqpooUF9COYX65JEezW8CFuu1K79lfXnz0rgEK6mTQYM+SVsCt4U07ivqNaHRlnId/hF9odTUDSHGQYw2lUxXZY7HjAGRRqTmFwJ2gs/8uNPvKd9NccGB/++JuLN/JPHZmsAPuicVOIu2hIPAyHvw4qgG7zGWxD88Sm4xs/CyJsQLHBKhYVrI+YR9VoRKAjRLHuBhOEBFv6fVnrj30ovnoPAEP/4m/ycSg8Rt+uVKCU6eYSHBiCAIuM51+zBXHDlGEWwqQRPXNRw3hGwIDAQAB`
var privatekey string = `MIIEpAIBAAKCAQEA0WccMR7XTIgyblCvzy/94kb3J0KZYVFWQEwanvvyDKWggKxzX85dERXPpoKGKhbHW9PkeHA21jmo7qBB4s/zN2Gcd9gSJWG0YGFh1MwiXUZ648Skzd0TkGA4cyveIeUJfLX2N/jr3h62TFiL+aG3eSMWiquvKZMIkzkE1QedwFXyioPp6tFDWUSdqXbBOuMLTwjyxVlF7d6EaHnMVqbQNtewH45mbzGh4lhE6eqv5ds+ts0K8GIc5un0I30RRacfWJcvCTiA8KpbsQUQeqqo2+LnIzDgBNrLqBc8+Km0HbPwELBj/cxmxaQVgatk5cpCKp2Cm6WF0RVLvJTkTRuPbQIDAQABAoIBAQCoZVH/knyzWAeuPQbVCBQURtt04BL2dvF0rX7vAU9KqlsjfwsdLZgcKD0f+3EnIcBacVEXJa6DokTe+VNisbY2gDHTEpitJSBoLYf+F9c+yXID/txFjRaxkR90Rv/QpB54AuCpbG1J58rUJJUUP9+K9BOpmp03Qr2vnzfqlMBgrYggXCehWRchsgeZ3Y1H4cFLVD2yzJkZ3YCSqeo2cbO4ifn02rYYWybvc9jS+3O6OWvKCFFB3suNe15hsIm33RrClGtcjLzS5iymLd105Fz/AgEGzzB0Yr0HRTDq5e4RUmFnOvu2rmgD9OZ/wzZdt9dypdnMA0GvvED2yCS7LAClAoGBAPgs1CeOl57ci1MuaJakSWo69LcQtS8O2/8OQcLxNE+BnWFfMlst3dLWOsXXBOVD+eY6sUZiSXD8nmUWh8BKqdwoAuTQyR1ofrxyWBFFXCHIIpOi+a/lbRGb4PY2m85iBp/B6Hdm4s18M+nvVCtchB+cmHpmgiEqrHY4AefdRvm/AoGBANgBU5DOsPyaBJ5BxWvNPuvN7P12bQQ7IyuXcHYBlZAPnulvt+1MmagqarLdRT7xzuWrBBTnyIbwdGkGy2tQunDgDp/BNGYLgoc0K+r7sGUvagn8IIRlYRS2EJd6XpCF8nDZcsimstBEH+O8sGL/2N8i7AxaArWJH94WDtGALAnTAoGBAJCyeoQR1H9QcX9vSJXEdfWVKEdwW2Nzk3tzkY4a2ngcx2kVeyPEa1hZhe0CAB24c4Tz5ZZ3CgDxmVyxNTc9kSoGviExRoF6AqLXPFfdi+k6akaQOGqBJwWkUBbeIhvD9b7B7Uto1oYei5oy621YxMQ1poV/LRIvclx/LUVGM/K7AoGAStcy0AJ9Whg3L2oUcAR+H4+K5EsK/KNMzUa8RXbJDlALPFBkBsk6mASSUYTPAD8h83tsf53LYc2gV99tzbH71y4agwmbERw9zoCqEtG/zV8/O1RrI9RIbbejSgixCRwP4z/EQHdZj0V7UxnGd5az2qQr6x+ovqNTMkysN7RUDdcCgYAcLSIU77y8UMYIdRGoGi5VGzdPMhFXx2aJuT2qgmt4pmqyemOezX47+Rxb3OLHNHQ8rhT4UxHM04/84dmN6hHBySYDpTUbu10MwvKWTwLHzcRYt7zMWJDgFNX4F45hotljkEfnXpzlckNtrRe3s0/Bdp5wriuvNLsP/IVI0/Dcng==`

func Pay(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	uid := r.URL.Query().Get("uid")
	order := r.URL.Query().Get("order")
	price := r.URL.Query().Get("price")
	ctime := time.Now().In(time.FixedZone("CST", 8*3600)).Format("2006-01-02 15:04:05")
	p := `app_id=2021003130695981&biz_content={"subject":"CliCli超大会员","body":` + uid + `,"out_trade_no":` + order + `,"total_amount":` + price + `}&charset=UTF-8&method=alipay.trade.precreate&notify_url=https://www.clicli.cc/vip/callback&sign_type=RSA2&timestamp=` + ctime + "&version=1.0"
	p2 := `app_id=2021003130695981&biz_content=` + url.QueryEscape(`{"subject":"CliCli超大会员","body":`+uid+`,"out_trade_no":`+order+`,"total_amount":`+price+`}`) + `&charset=UTF-8&method=alipay.trade.precreate&notify_url=` + url.QueryEscape(`https://www.clicli.cc/vip/callback`) + `&sign_type=RSA2&timestamp=` + url.QueryEscape(ctime) + "&version=1.0"
	fmt.Printf("p: %v\n", p)
	sign := RsaSign(p, privatekey, crypto.SHA256)
	fmt.Printf("p: %v\n", sign)
	aaa := "https://openapi.alipay.com/gateway.do?" + p2 + "&sign=" + url.QueryEscape(sign)
	body := httpPost(aaa)
	io.WriteString(w, string(body))

}

func Check(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	order := r.URL.Query().Get("order")
	//2023011122001430791454534176
	ctime := time.Now().In(time.FixedZone("CST", 8*3600)).Format("2006-01-02 15:04:05")
	p := `app_id=2021003130695981&biz_content={"out_trade_no":` + order + `}&charset=UTF-8&method=alipay.trade.query&out_trade_no=999&sign_type=RSA2&timestamp=` + ctime + "&version=1.0"
	p2 := `app_id=2021003130695981&biz_content={"out_trade_no":` + order + `}&charset=UTF-8&method=alipay.trade.query&out_trade_no=999&sign_type=RSA2&timestamp=` + url.QueryEscape(ctime) + "&version=1.0"
	fmt.Printf("p: %v\n", p)
	sign := RsaSign(p, privatekey, crypto.SHA256)
	fmt.Printf("p: %v\n", sign)
	aaa := "https://openapi.alipay.com/gateway.do?" + p2 + "&sign=" + url.QueryEscape(sign)
	body := httpPost(aaa)
	io.WriteString(w, string(body))

}

func Callback(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	r.ParseForm()
	body := r.Form.Get("body")
	a := r.Form.Get("total_amount")
	amount, _ := strconv.ParseFloat(a, 64)
	// amount, _ := strconv.Atoi(r.URL.Query().Get("total_amount"))
	fmt.Println(body)
	fmt.Println(a)
	fmt.Println("充值回调")
	uid, _ := strconv.Atoi(body)
	user, err := db.GetUser("", uid, "")

	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}

	aamount := user.Time + int(amount*100)

	fmt.Println(aamount)

	_, err2 := db.UpdateUser(user.Id, user.Name, "", user.Level, user.QQ, aamount, user.Sign)

	if err2 != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
		return
	}

	io.WriteString(w, "success")

}

const (
	PEM_BEGIN = "-----BEGIN RSA PRIVATE KEY-----\n"
	PEM_END   = "\n-----END RSA PRIVATE KEY-----"
)

func RsaSign(signContent string, privateKey string, hash crypto.Hash) string {
	shaNew := hash.New()
	shaNew.Write([]byte(signContent))
	hashed := shaNew.Sum(nil)
	priKey, err := ParsePrivateKey(privateKey)
	if err != nil {
		panic(err)
	}

	signature, err := rsa.SignPKCS1v15(rand.Reader, priKey, hash, hashed)
	if err != nil {
		panic(err)
	}
	return base64.StdEncoding.EncodeToString(signature)
}

func ParsePrivateKey(privateKey string) (*rsa.PrivateKey, error) {
	privateKey = FormatPrivateKey(privateKey)
	block, _ := pem.Decode([]byte(privateKey))
	if block == nil {
		return nil, errors.New("私钥信息错误！")
	}
	priKey, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return nil, err
	}
	return priKey, nil
}

func FormatPrivateKey(privateKey string) string {
	if !strings.HasPrefix(privateKey, PEM_BEGIN) {
		privateKey = PEM_BEGIN + privateKey
	}
	if !strings.HasSuffix(privateKey, PEM_END) {
		privateKey = privateKey + PEM_END
	}
	return privateKey
}

func httpPost(url string) string {
	resp, err := http.Post(url,
		"application/x-www-form-urlencoded",
		strings.NewReader(""))
	if err != nil {
		fmt.Println(err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
	}
	return string(body)
}
