package db

import (
	"database/sql"
)

func GetPea(uid int) (*Pea, error) {
	stmtCount, err := dbConn.Prepare("SELECT pea FROM pea WHERE uid = $1")
	var pea int
	err = stmtCount.QueryRow(uid).Scan(&pea)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	res := &Pea{Uid: uid, Pea: pea}

	defer stmtCount.Close()
	return res, nil
}

func ReplacePea(uid int, pea int) (*Pea, error) {
	stmtIns, err := dbConn.Prepare("INSERT INTO pea (uid,pea) VALUES ($1,$2) ON conflict(uid) DO UPDATE SET pea=$3")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(uid, pea,pea)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Pea{Uid: uid, Pea: pea}
	return res, nil
}