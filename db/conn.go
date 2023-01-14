package db

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"os"
	"time"
)

var (
	dbConn *sql.DB
	err    error
)

func init() {
	str := os.Getenv("DATABASE_STR")
	fmt.Println(str)
	dbConn, err = sql.Open("postgres", str)

	if err != nil {
		panic(err.Error())
	}

	dbConn.SetMaxOpenConns(8)
	dbConn.SetConnMaxLifetime(time.Minute)

	err = dbConn.Ping()
	if err != nil {
		panic(err.Error())
	}

}
