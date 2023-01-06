package db

import (
	"database/sql"
	"fmt"
	"os"
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
		panic(err.Error())
	}
	
	defer dbConn.Close()
}
