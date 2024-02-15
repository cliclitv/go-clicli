package db

import (
	"database/sql"
	_ "database/sql"
)

func ReplaceAction(uid int, action string, pid int) (*Action, error) {
	stmt, err := dbConn.Prepare("INSERT INTO actions (uid,action,pid) VALUES ($1,$2,$3) ON conflict(uid,action,pid) DO DELETE FROM actions WHERE uid=$4 AND action=$5 AND pid=$6")
	if err != nil {
		return nil, err
	}
	_, err = stmt.Exec(uid, action, pid, uid, action, pid)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	res := &Action{Uid: uid, Action: action, Pid: pid}
	return res, err
}

func GetActionCount(action string, pid int) (*Count, error) {
	stmtCount, err := dbConn.Prepare("SELECT COUNT(*) FROM fan WHERE action=$1 AND pid=$2")
	var count int
	err = stmtCount.QueryRow(action, pid).Scan(&count)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	res := &Count{Action: action, Pid: pid, Count: count}

	defer stmtCount.Close()
	return res, nil
}

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
