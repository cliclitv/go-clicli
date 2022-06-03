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

type middleWareHandler struct {
	r *httprouter.Router
}

var whiteOrigins = [5]string{
	"https://admin.clicli.cc",
	"https://www.clicli.cc",
	"https://clicli.cc",
	"http://localhost:3000",
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
	router.POST("/user/register", handler.Auth(handler.Register, 0))
	router.POST("/user/login", handler.Auth(handler.Login, 0))
	router.POST("/user/logout", handler.Auth(handler.Logout, 0)) // 前端清空 localstorage
	router.POST("/user/update/:id", handler.Auth(handler.UpdateUser, 3))
	router.POST("/user/delete/:id", handler.Auth(handler.DeleteUser, 3))
	router.GET("/users", handler.Auth(handler.GetUsers, 3))
	router.GET("/user", handler.Auth(handler.GetUser, 3))
	router.POST("/post/add", handler.Auth(handler.AddPost, 1))
	router.POST("/post/delete/:id", handler.Auth(handler.DeletePost, 3))
	router.POST("/post/update/:id", handler.Auth(handler.UpdatePost, 1))
	router.GET("/post/:id", handler.Auth(handler.GetPost, 0))
	router.GET("/posts", handler.Auth(handler.GetPosts, 0))
	router.GET("/search/posts", handler.Auth(handler.SearchPosts, 0))
	router.GET("/search/users", handler.Auth(handler.SearchUsers, 0))
	router.GET("/play", handler.Auth(handler.GetPlay, 0))
	router.GET("/pv/:pid", handler.Auth(handler.GetPv, 0))
	router.GET("/rank", handler.Auth(handler.GetRank, 0))

	fsys, _ := fs.Sub(embededFiles, "fre/dist")
	router.ServeFiles("/assets/*filepath", http.FS(fsys))
	router.Handler("GET", "/", http.FileServer(http.FS(fsys)))

	return router
}

func main() {
	for _, s := range whiteOrigins {
		whiteOriginsSet[s] = true
	}
	router := RegisterHandler()
	http.ListenAndServe(":4000", router)
}
