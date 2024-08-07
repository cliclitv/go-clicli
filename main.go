package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"

	"github.com/cliclitv/go-clicli/svc"
	"github.com/julienschmidt/httprouter"
)

//go:embed fre/dist
var cli_files embed.FS

//go:embed fre/dist/index.html
var cli_index string

type middleWareHandler struct {
	r *httprouter.Router
}

var whiteOrigins = [6]string{
	"https://www.clicli.cc",
	"https://www.acgzone.fun",
	"https://clicli.cc",
	"http://localhost:3000",
	"https://cdn.clicli.cc",
}

func NewMiddleWareHandler(r *httprouter.Router) http.Handler {
	m := middleWareHandler{}
	m.r = r
	return m
}

var whiteOriginsSet = make(map[string]bool)

func (m middleWareHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	if whiteOriginsSet[origin] {
		w.Header().Add("Access-Control-Allow-Origin", origin)
	}

	w.Header().Add("Access-Control-Allow-Credentials", "true")
	w.Header().Add("Access-Control-Allow-Methods", "*")
	w.Header().Add("Access-Control-Allow-Headers", "*")
	m.r.ServeHTTP(w, r)
}

func RegisterHandler() *httprouter.Router {
	router := httprouter.New()

	router.POST("/user/register", svc.Register) // 需要限流
	router.POST("/user/login", svc.Login)
	router.POST("/user/logout", svc.Logout) // 前端清空 localstorage
	router.GET("/users", svc.GetUsers)
	router.GET("/user", svc.GetUser)

	router.POST("/comment/add", svc.AddComment) // 需要限流
	router.GET("/comment/delete/:id", svc.DeleteComment)
	router.GET("/comments", svc.GetComments)
	router.POST("/comment/uv", svc.UpdateCommentUv)

	router.POST("/post/uv", svc.UpdateUv)
	router.POST("/post/add", svc.AddPost)
	router.GET("/post/:id", svc.GetPost)
	router.GET("/posts", svc.GetPosts)
	router.GET("/search/posts", svc.SearchPosts)
	router.GET("/play", svc.GetPlay)
	router.GET("/rank", svc.GetRank)
	router.GET("/pv/:pid", svc.GetPv)
	router.GET("/vip/pay", svc.Pay)
	router.GET("/vip/paycheck", svc.Check)
	router.POST("/vip/callback", svc.Callback)

	fsys, _ := fs.Sub(cli_files, "fre/dist")
	router.ServeFiles("/assets/*filepath", http.FS(fsys))

	router.NotFound = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(cli_index))
	})

	return router
}

func main() {
	for _, s := range whiteOrigins {
		whiteOriginsSet[s] = true
	}
	r := RegisterHandler()
	mh := NewMiddleWareHandler(r)

	go func() {
		fmt.Println("server is run on http://localhost:4000")
		http.ListenAndServe(":4000", mh)
	}()

	svc.StartLive()
}
