package db

import (
	"database/sql"
)

func GetFanCount(uid int) (*FanCount, error) {
	stmtCount, err := dbConn.Prepare("SELECT COUNT(*) FROM fan WHERE uid = $1")
	stmtCount2, err2 := dbConn.Prepare("SELECT COUNT(*) FROM fan WHERE follow = $1")
	var following, followed int
	err = stmtCount.QueryRow(uid).Scan(&following)
	err2 = stmtCount2.QueryRow(uid).Scan(&followed)
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

func CheckFans(from int, to int) (int, error) {
	stmt, err := dbConn.Prepare("SELECT COUNT(*) FROM fan WHERE (uid = $1 AND follow = $2)")
	if err != nil {
		return 0, err
	}
	var count int
	err = stmt.QueryRow(from, to).Scan(&count)
	if err != nil {
		return 0, err
	}
	defer stmt.Close()
	
	return count, nil
}


func Follow(from int, to int) (*Fan, error) {
	stmtIns, err := dbConn.Prepare("INSERT INTO fan (uid,follow) VALUES ($1,$2)")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(from, to)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Fan{From: from, To: to}
	return res, nil
}

func Unfollow(from int, to int) error {
	stmtDel, err := dbConn.Prepare("DELETE FROM fan WHERE uid =$1 AND follow = $2")
	if err != nil {
		return err
	}
	_, err = stmtDel.Exec(from, to)
	if err != nil {
		return err
	}
	defer stmtDel.Close()

	return nil
}
