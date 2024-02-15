package db

import (
	"database/sql"
	_ "github.com/lib/pq"
	"os"
	"fmt"
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

	//dbConn.SetMaxOpenConns(100)
	//dbConn.SetConnMaxLifetime(time.Minute)

}
