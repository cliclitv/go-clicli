package db

import (
	"database/sql"
)

func GetFanCount(uid int) (*FanCount, error) {
	stmtCount, err := dbConn.Prepare("SELECT Count(*) FROM fan WHERE uid = $1")
	stmtCount, err2 := dbConn.Prepare("SELECT Count(*) FROM fan WHERE follow = $1")
	var following, followed int
	err = stmtCount.QueryRow(uid).Scan(&following)
	err2 = stmtCount.QueryRow(uid).Scan(&followed)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	if err2 != nil && err2 != sql.ErrNoRows {
		return nil, err
	}


	res := &FanCount{Following: following, Followed: followed}

	defer stmtCount.Close()
	return res, nil
}

func Follow(uid int, follow int) (*Fan, error) {
	stmtIns, err := dbConn.Prepare("INSERT INTO up (uid,follow) VALUES ($1,$2) ON conflict(uid) DO UPDATE SET follow=$3")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(uid, follow,follow)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Fan{Uid: uid, Follow: follow}
	return res, nil
}

func Unfollow(uid int, follow int) error {
	stmtDel, err := dbConn.Prepare("DELETE FROM users WHERE uid =$1 & follow = $2")
	if err != nil {
		return err
	}
	_, err = stmtDel.Exec(uid, follow)
	if err != nil {
		return err
	}
	defer stmtDel.Close()

	return nil
}