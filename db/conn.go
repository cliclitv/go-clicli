package db

import (
	"database/sql"
	// "os"
	_ "github.com/lib/pq"
)

var (
	dbConn *sql.DB
	err    error
)

func init() {
	// str := os.Getenv("POSTGRES_STR")
	str:="postgres://postgres:123456@localhost:5432/clicli?sslmode=disable"
	dbConn, err = sql.Open("postgres", str)
	if err != nil {
		panic(err.Error())
	}
}
