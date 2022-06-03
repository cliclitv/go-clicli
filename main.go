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
	router.GET("/play", handler.GetPlay)
	router.GET("/pv/:pid", handler.GetPv)
	router.GET("/rank", handler.GetRank)

	fsys, _ := fs.Sub(embededFiles, "fre/dist")
	router.ServeFiles("/assets/*filepath", http.FS(fsys))
	router.Handler("GET", "/", http.FileServer(http.FS(fsys)))


	return router
}

func main() {
	for _, s := range whiteOrigins {
		whiteOriginsSet[s] = true
	}

	token, _ := handler.GenToken("132","132",1)

	mc, err := handler.ParseToken(token)

	fmt.Printf("mc: %v\n", mc)
	fmt.Printf("mc.Name: %v\n", mc.Name)
	fmt.Printf("err: %v\n", err)

	router := RegisterHandler()
	http.ListenAndServe(":4000", router)
}
