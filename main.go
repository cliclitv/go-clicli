package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"github.com/cliclitv/go-clicli/handler"
	"github.com/julienschmidt/httprouter"
)

//go:embed fre/dist
var embededFiles embed.FS

//go:embed fre/dist/index.html
var html string

type middleWareHandler struct {
	r *httprouter.Router
}

var whiteOrigins = [5]string{
	"https://admin.clicli.cc",
	"https://www.clicli.cc",
	"https://clicli.cc",
	"http://localhost:3000",
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
	w.Header().Add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token")
	m.r.ServeHTTP(w, r)
}

func RegisterHandler() *httprouter.Router {
	router := httprouter.New()
	router.POST("/user/register", handler.Register)
	// router.POST("/user/login", handler.Login)
	router.POST("/user/logout", handler.Logout) // 前端清空 localstorage
	router.POST("/user/update/:id", handler.Auth(handler.UpdateUser, 3))
	router.POST("/user/delete/:id", handler.Auth(handler.DeleteUser, 4))
	router.GET("/users", handler.GetUsers)
	router.GET("/user", handler.GetUser)
	router.POST("/post/add", handler.Auth(handler.AddPost, 2))
	router.POST("/post/delete/:id", handler.Auth(handler.DeletePost, 3))
	router.POST("/post/update/:id", handler.Auth(handler.UpdatePost, 2))
	router.GET("/post/:id", handler.GetPost)
	router.GET("/posts", handler.GetPosts)
	router.GET("/search/posts", handler.SearchPosts)
	router.GET("/search/users", handler.SearchUsers)
	router.GET("/play", handler.GetPlay)
	router.GET("/pv/:pid", handler.GetPv)
	router.GET("/rank", handler.GetRank)
	router.GET("/vip/pay", handler.Pay)
	router.GET("/vip/paycheck", handler.Check)
// 	router.GET("/eth/transfer", handler.Transfer)
// 	router.GET("/eth/balanceof", handler.BalanceOf)

	fsys, _ := fs.Sub(embededFiles, "fre/dist")
	router.ServeFiles("/assets/*filepath", http.FS(fsys))
	router.Handler("GET", "/", http.FileServer(http.FS(fsys)))

	router.NotFound = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(html))
	})

	return router
}

func main() {
	for _, s := range whiteOrigins {
		whiteOriginsSet[s] = true
	}
	r := RegisterHandler()
	mh := NewMiddleWareHandler(r)
	fmt.Println("server is run on http://localhost:4000")
	http.ListenAndServe(":4000", mh)
}
