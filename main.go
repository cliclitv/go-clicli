package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/cliclitv/go-clicli/handler"
	"github.com/cliclitv/go-clicli/util"
	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
	"github.com/nilslice/jwt"
)

type middleWareHandler struct {
	r *httprouter.Router
}

var whiteOrigins = [...]string{"http://localhost:3000"}
var whiteOriginsSet = make(map[string]bool)

func NewMiddleWareHandler(r *httprouter.Router) http.Handler {
	m := middleWareHandler{}
	m.r = r
	return m
}

func (m middleWareHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	if whiteOriginsSet[origin] {
		w.Header().Add("Access-Control-Allow-Origin", origin)
	}

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
	router.POST("/post/delete/:id", handler.DeletePost)
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
	router.GET("/jx", handler.Jx)

	router.POST("/upload", handler.UploadFile)
	router.ServeFiles("/upload/*filepath", http.Dir("upload"))

	return router
}

func main() {
	env := "dev"
	env = os.Getenv("env")
	if errr := godotenv.Load(".env." + env); errr != nil {
		fmt.Print(errr)
	}

	for _, s := range whiteOrigins {
		whiteOriginsSet[s] = true
	}

	str := util.RandStr(10)
	jwt.Secret([]byte(str))
	r := RegisterHandler()
	mh := NewMiddleWareHandler(r)
	log.Fatal(http.ListenAndServe(":8080", mh))
}
