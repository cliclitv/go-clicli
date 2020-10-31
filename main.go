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
	w.Header().Add("Access-Control-Allow-Origin", "http://localhost:8080")
	w.Header().Add("Access-Control-Allow-Credentials", "true")
	w.Header().Add("Access-Control-Allow-Methods", "*")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type,token")
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
	router.POST("/video/add", handler.AddVideo)
	router.POST("/video/update/:id", handler.UpdateVideo)
	router.POST("/video/delete", handler.DeleteVideo)
	router.GET("/video/:id", handler.GetVideo)
	router.GET("/videos", handler.GetVideos)
	router.GET("/search/posts", handler.SearchPosts)
	router.GET("/search/users", handler.SearchUsers)
	router.GET("/auth", handler.Auth)
	router.POST("/cookie/replace", handler.ReplaceCookie)
	router.GET("/cookie/:uid", handler.GetCookie)
	router.GET("/pv/:pid", handler.GetPv)
	router.GET("/rank", handler.GetRank)

	return router
}

func main() {
	str := util.RandStr(10)
	jwt.Secret([]byte(str))
	r := RegisterHandler()
	mh := NewMiddleWareHandler(r)
	http.ListenAndServe(":8084", mh)
}
