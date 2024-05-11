package db

import (
	"database/sql"
)

func UpdatePv(pid int) error {
	stmtCount, err := dbConn.Prepare("UPDATE posts SET pv = (COALESCE(pv, 0)+1) WHERE id = $1")
	if err != nil {
		return err
	}
	_, err = stmtCount.Exec(pid)
	if err != nil && err != sql.ErrNoRows {
		return err
	}
	defer stmtCount.Close()
	return nil
}