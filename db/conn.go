package db

import (
	"database/sql"
	"os"
	_ "github.com/lib/pq"
)

var (
	dbConn *sql.DB
	err    error
)

func init() {
	str := os.Getenv("DATABASE_STR")
	dbConn, err = sql.Open("postgres", str)
	if err != nil {
		panic(err.Error())
	}
}
