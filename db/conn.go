package db

import (
	"database/sql"
	"fmt"
	"os"
	_ "github.com/go-sql-driver/mysql"
)

var (
	dbConn *sql.DB
	err    error
)

func init() {
	str := os.Getenv("MYSQL_STR")
	dbConn, err = sql.Open("mysql", str)
	if err != nil {
		panic(err.Error())
	}
}
