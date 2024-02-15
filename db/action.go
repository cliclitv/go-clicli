package db

import (
	_ "database/sql"
)

func AddAction(uid int, action string, pid int) (*Action, error) {
	stmtIns, err := dbConn.Prepare("INSERT INTO actions (uid,action,pid) VALUES ($1,$2,$3)")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(uid, action, pid)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Action{Uid: uid, Action: action, Pid: pid}
	return res, err
}
