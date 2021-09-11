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
	host := os.Getenv("MysqlHostname")
	user := os.Getenv("MysqlUsername")
	db := os.Getenv("MysqlDB")
	pwd := os.Getenv("MysqlPassword")
	str := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8", user, pwd, host, db)
	dbConn, err = sql.Open("mysql", str)
	if err != nil {
		panic(err.Error())
	}
}
