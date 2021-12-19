package main

import (
	"github.com/cliclitv/go-clicli/handler"
	"github.com/julienschmidt/httprouter"
	"github.com/nilslice/jwt"
	"github.com/cliclitv/go-clicli/util"
	"net/http"
)

type middleWareHandler struct {
	r *httprouter.Router
}

func NewMiddleWareHandler(r *httprouter.Router) http.Handler {
	m := middleWareHandler{}
	m.r = r
	return m
}
func (m middleWareHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if  r.Header.Get("Origin") == "https://admin.clicli.cc" {
		w.Header().Add("Access-Control-Allow-Origin", "https://admin.clicli.cc")
	}

	if  r.Header.Get("Origin") == "https://www.clicli.cc" {
		w.Header().Add("Access-Control-Allow-Origin", "https://www.clicli.cc")
	}
	
	if  r.Header.Get("Origin") == "https://clicli.cc" {
		w.Header().Add("Access-Control-Allow-Origin", "https://clicli.cc")
	}

	w.Header().Add("Access-Control-Allow-Credentials", "true")
	w.Header().Add("Access-Control-Allow-Methods", "*")
	w.Header().Add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token")
	m.r.ServeHTTP(w, r)
}

func RegisterHandler() *httprouter.Router {
	router := httprouter.New()
	router.POST("/user/register", handler.Register)
	router.POST("/user/login", handler.Login)
	router.POST("/user/logout", handler.Logout)
	router.POST("/user/update/:id", handler.UpdateUser)
	// router.POST("/user/delete/:id", handler.DeleteUser)
	router.GET("/users", handler.GetUsers)
	router.GET("/user", handler.GetUser)
	router.POST("/post/add", handler.AddPost)
	// router.POST("/post/delete/:id", handler.DeletePost)
	router.POST("/post/update/:id", handler.UpdatePost)
	router.GET("/post/:id", handler.GetPost)
	router.GET("/posts", handler.GetPosts)
	router.GET("/search/posts", handler.SearchPosts)
	router.GET("/search/users", handler.SearchUsers)
	router.GET("/auth", handler.Auth)
	router.GET("/play", handler.GetPlay)
	router.GET("/pv/:pid", handler.GetPv)
	router.GET("/rank", handler.GetRank)

	return router
}

func main() {
	str := util.RandStr(10)
	jwt.Secret([]byte(str))
	r := RegisterHandler()
	mh := NewMiddleWareHandler(r)
	http.ListenAndServe(":4000", mh)
}
