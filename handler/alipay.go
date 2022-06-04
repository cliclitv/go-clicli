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
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
	"time"
)

var publickey string = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApmDKNmbEQSBaijjZCX1tfPZtFD4MTnnNDuDQEeB3uNA48Qk4KmrMAo3LDDqvFTQ7MHLJcHzqpooUF9COYX65JEezW8CFuu1K79lfXnz0rgEK6mTQYM+SVsCt4U07ivqNaHRlnId/hF9odTUDSHGQYw2lUxXZY7HjAGRRqTmFwJ2gs/8uNPvKd9NccGB/++JuLN/JPHZmsAPuicVOIu2hIPAyHvw4qgG7zGWxD88Sm4xs/CyJsQLHBKhYVrI+YR9VoRKAjRLHuBhOEBFv6fVnrj30ovnoPAEP/4m/ycSg8Rt+uVKCU6eYSHBiCAIuM51+zBXHDlGEWwqQRPXNRw3hGwIDAQAB`
var privatekey string = `MIIEpAIBAAKCAQEA0WccMR7XTIgyblCvzy/94kb3J0KZYVFWQEwanvvyDKWggKxzX85dERXPpoKGKhbHW9PkeHA21jmo7qBB4s/zN2Gcd9gSJWG0YGFh1MwiXUZ648Skzd0TkGA4cyveIeUJfLX2N/jr3h62TFiL+aG3eSMWiquvKZMIkzkE1QedwFXyioPp6tFDWUSdqXbBOuMLTwjyxVlF7d6EaHnMVqbQNtewH45mbzGh4lhE6eqv5ds+ts0K8GIc5un0I30RRacfWJcvCTiA8KpbsQUQeqqo2+LnIzDgBNrLqBc8+Km0HbPwELBj/cxmxaQVgatk5cpCKp2Cm6WF0RVLvJTkTRuPbQIDAQABAoIBAQCoZVH/knyzWAeuPQbVCBQURtt04BL2dvF0rX7vAU9KqlsjfwsdLZgcKD0f+3EnIcBacVEXJa6DokTe+VNisbY2gDHTEpitJSBoLYf+F9c+yXID/txFjRaxkR90Rv/QpB54AuCpbG1J58rUJJUUP9+K9BOpmp03Qr2vnzfqlMBgrYggXCehWRchsgeZ3Y1H4cFLVD2yzJkZ3YCSqeo2cbO4ifn02rYYWybvc9jS+3O6OWvKCFFB3suNe15hsIm33RrClGtcjLzS5iymLd105Fz/AgEGzzB0Yr0HRTDq5e4RUmFnOvu2rmgD9OZ/wzZdt9dypdnMA0GvvED2yCS7LAClAoGBAPgs1CeOl57ci1MuaJakSWo69LcQtS8O2/8OQcLxNE+BnWFfMlst3dLWOsXXBOVD+eY6sUZiSXD8nmUWh8BKqdwoAuTQyR1ofrxyWBFFXCHIIpOi+a/lbRGb4PY2m85iBp/B6Hdm4s18M+nvVCtchB+cmHpmgiEqrHY4AefdRvm/AoGBANgBU5DOsPyaBJ5BxWvNPuvN7P12bQQ7IyuXcHYBlZAPnulvt+1MmagqarLdRT7xzuWrBBTnyIbwdGkGy2tQunDgDp/BNGYLgoc0K+r7sGUvagn8IIRlYRS2EJd6XpCF8nDZcsimstBEH+O8sGL/2N8i7AxaArWJH94WDtGALAnTAoGBAJCyeoQR1H9QcX9vSJXEdfWVKEdwW2Nzk3tzkY4a2ngcx2kVeyPEa1hZhe0CAB24c4Tz5ZZ3CgDxmVyxNTc9kSoGviExRoF6AqLXPFfdi+k6akaQOGqBJwWkUBbeIhvD9b7B7Uto1oYei5oy621YxMQ1poV/LRIvclx/LUVGM/K7AoGAStcy0AJ9Whg3L2oUcAR+H4+K5EsK/KNMzUa8RXbJDlALPFBkBsk6mASSUYTPAD8h83tsf53LYc2gV99tzbH71y4agwmbERw9zoCqEtG/zV8/O1RrI9RIbbejSgixCRwP4z/EQHdZj0V7UxnGd5az2qQr6x+ovqNTMkysN7RUDdcCgYAcLSIU77y8UMYIdRGoGi5VGzdPMhFXx2aJuT2qgmt4pmqyemOezX47+Rxb3OLHNHQ8rhT4UxHM04/84dmN6hHBySYDpTUbu10MwvKWTwLHzcRYt7zMWJDgFNX4F45hotljkEfnXpzlckNtrRe3s0/Bdp5wriuvNLsP/IVI0/Dcng==`

func Pay(order string, name string, price string) {
	ctime := time.Now().In(time.FixedZone("CST", 8*3600)).Format("2006-01-02 15:04:05")
	p := `app_id=2021003130695981&biz_content={"subject":` + name + `,"out_trade_no":` + order + `,"total_amount":` + price + `}&charset=UTF-8&method=alipay.trade.precreate&notify_url=http://www.qq.com&sign_type=RSA2&timestamp=` + ctime + "&version=1.0"
	p2 := `app_id=2021003130695981&biz_content=` + url.QueryEscape(`{"subject":`+name+`,"out_trade_no":`+order+`,"total_amount":`+price+`}`) + `&charset=UTF-8&method=alipay.trade.precreate&notify_url=` + url.QueryEscape(`http://www.qq.com`) + `&sign_type=RSA2&timestamp=` + url.QueryEscape(ctime) + "&version=1.0"

	sign := RsaSign(p, privatekey, crypto.SHA256)
	aaa := "https://openapi.alipay.com/gateway.do?" + p2 + "&sign=" + url.QueryEscape(sign)
	body := Get(aaa)
	fmt.Printf("body: %v\n", body)

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

func Get(url string) string {
	resp, err := http.Get(url)
	if err != nil {
	}
	defer resp.Body.Close()
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
	}
	return string(b)
}
