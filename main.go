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
var cli_files embed.FS

//go:embed tm/dist
var tm_files embed.FS

//go:embed fre/dist/index.html
var cli_index string

//go:embed tm/dist/index.html
var tm_index string

type middleWareHandler struct {
	r *httprouter.Router
}

var whiteOrigins = [8]string{
	"https://www.clicli.cc",
	"https://clicli.cc",
	"http://localhost:3000",
	"https://cdn.clicli.cc",
	"https://www.cli.plus",
	"https://www.tm0.net",
	"http://localhost:4000",
	"http://localhost:6000",
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
	router.POST("/user/login", handler.Login)
	router.POST("/user/logout", handler.Logout) // 前端清空 localstorage
	router.POST("/user/update/:id", handler.UpdateUser)
	// router.POST("/user/delete/:id", handler.DeleteUser)
	router.GET("/users", handler.GetUsers)
	router.GET("/user", handler.GetUser)
	router.POST("/post/add", handler.AddPost)
	router.POST("/comment/add", handler.AddComment)
	router.GET("/comments", handler.GetComments)
	// router.POST("/post/delete/:id", handler.DeletePost)
	router.POST("/post/update/:id", handler.UpdatePost)
	router.GET("/post/:id", handler.GetPost)
	router.GET("/posts", handler.GetPosts)
	router.GET("/search/posts", handler.SearchPosts)
	router.GET("/follow/posts", handler.FollowPosts)
	router.GET("/search/users", handler.SearchUsers)
	router.GET("/play", handler.GetPlay)
	router.GET("/pv/:pid", handler.GetPv)

	router.POST("/pea", handler.GetPea)
	router.POST("/fan/follow", handler.Follow)
	router.GET("/fan/:uid", handler.GetFanCount)

	router.GET("/rank", handler.GetRank)
	router.GET("/vip/pay", handler.Pay)
	router.GET("/vip/paycheck", handler.Check)
	router.POST("/vip/callback", handler.Callback)

	router.POST("/article/add", handler.AddArticle)
	router.POST("/article/update/:id", handler.UpdateArticle)
	router.GET("/article/:id", handler.GetArticle)
	router.GET("/article", handler.GetArticleByOid)
	router.GET("/articles", handler.GetArticles)

	fsys, _ := fs.Sub(cli_files, "fre/dist")
	router.ServeFiles("/assets/*filepath", http.FS(fsys))

	fsys2, _ := fs.Sub(tm_files, "tm/dist")
	router.ServeFiles("/assets2/*filepath", http.FS(fsys2))

	// router.Handler("GET", "/", http.FileServer(http.FS(fsys)))
	// router.Handler("GET", "/tm", http.FileServer(http.FS(fsys2)))

	router.NotFound = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		host := r.Host
		fmt.Println(host)
		if host == "www.tm0.net" {
			w.Write([]byte(tm_index))

		} else {
			w.Write([]byte(cli_index))
		}

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
