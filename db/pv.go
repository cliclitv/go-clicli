package db

import (
	"database/sql"
)

func GetPv(pid int) (*Pv, error) {
	stmtCount, err := dbConn.Prepare("SELECT pv FROM pv WHERE pid = $1")
	var pv int
	err = stmtCount.QueryRow(pid).Scan(&pv)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	res := &Pv{Pid: pid, Pv: pv}

	defer stmtCount.Close()
	return res, nil
}

func ReplacePv(pid int, pv int) (*Pv, error) {
	stmtIns, err := dbConn.Prepare("INSERT INTO pv (pid,pv) VALUES ($1,$2) ON conflict(pid) DO UPDATE SET pv=$3")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(pid, pv, pv)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Pv{Pid: pid, Pv: pv}
	return res, nil
}
