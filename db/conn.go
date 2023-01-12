package db

import (
	"database/sql"
	"fmt"
	"os"
	"time"
	_ "github.com/lib/pq"
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
		fmt.Println(err)
	}
	
    dbConn.SetMaxOpenConns(8)
	dbConn.SetConnMaxLifetime(time.Minute)

}
