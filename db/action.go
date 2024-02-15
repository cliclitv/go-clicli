package db

import (
	"database/sql"
	_ "database/sql"
)

func AddAction(uid int, action string, pid int) (*Action, error) {
	stmt, err := dbConn.Prepare("INSERT INTO actions (uid,action,pid) VALUES ($1,$2,$3)")
	if err != nil {
		return nil, err
	}
	_, err = stmt.Exec(uid, action, pid)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	res := &Action{Uid: uid, Action: action, Pid: pid}
	return res, err
}

func DeleteAction(uid int, action string, pid int) error {
	stmt, err := dbConn.Prepare("DELETE FROM comments WHERE uid=$1 AND action=$2 AND pid=$3")
	if err != nil {
		return err
	}

	_, err = stmt.Exec(uid, action, pid)
	if err != nil {
		return err
	}
	defer stmt.Close()

	return nil
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
