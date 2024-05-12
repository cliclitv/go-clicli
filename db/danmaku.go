package db

import (
	"log"
	"time"
)

func AddDanmaku(content string, pid int, p int, uid int, pos int, color string) error {
	stmtIns, err := dbConn.Prepare("INSERT INTO danmakus (content,pid,p,uid,pos,color,time) VALUES ($1,$2,$3,$4,$5,$6,$7)")
	if err != nil {
		return err
	}

	cstZone := time.FixedZone("CST", 8*3600)
	ctime := time.Now().In(cstZone).Format("2006-01-02 15:04")

	_, err = stmtIns.Exec(content, pid, p, uid, pos, color, ctime)
	if err != nil {
		return err
	}
	defer stmtIns.Close()
	return nil
}

func GetDanmakus(pid int, p int, page int, pageSize int) ([]*Danmaku, error) {
	start := pageSize * (page - 1)
	var slice []interface{}

	query := "SELECT id, content,pid,uid,pos,p,color,time FROM danmakus WHERE pid = $1 AND P = $2 ORDER BY time DESC LIMIT $3 OFFSET $4"

	slice = append(slice, pid, p, pageSize, start)
	stmt, err := dbConn.Prepare(query)

	if err != nil {
		return nil, err
	}

	var res []*Danmaku

	rows, err := stmt.Query(slice...)
	if err != nil {
		return res, err
	}

	defer rows.Close()

	defer stmt.Close()

	for rows.Next() {
		var id, pid, uid, p, pos int
		var content, color, time string
		if err := rows.Scan(&id, &content, &pid, &uid, &pos, &p, &color, &time); err != nil {
			return res, err
		}

		c := &Danmaku{Id: id, Content: content, Pid: pid, Uid: uid, Pos: pos, P: p, Color: color, Time: time}
		res = append(res, c)
	}

	return res, nil

}

func DeleteDanmaku(id int) error {
	stmtDel, err := dbConn.Prepare("DELETE FROM danmakus WHERE id =$1")
	if err != nil {
		log.Printf("%s", err)
		return err
	}
	_, err = stmtDel.Exec(id)
	if err != nil {
		return err
	}
	defer stmtDel.Close()

	return nil
}
