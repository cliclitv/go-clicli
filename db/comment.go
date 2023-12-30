package db

import (
	_ "database/sql"
	"time"
)

func AddComment(content string, pid int, uid int, rid int, runame string, read int) (*Comment, error) {
	t := time.Now()
	ctime := t.Format("2006-01-02 15:04")
	stmtIns, err := dbConn.Prepare("INSERT INTO comments (content,time,pid,uid,rid,runame,read) VALUES ($1,$2,$3,$4,$5,$6,$7)")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(content, ctime, pid, uid, rid, runame, read)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Comment{Content: content, Time: ctime, Uid: uid, Pid: pid, Rid: rid, Runame: runame, Read: read}
	return res, err
}

func ReadComments(runame string) error {
	stmtIns, err := dbConn.Prepare("UPDATE comments set read=1 WHERE runame=$1")
	if err != nil {
		return err
	}
	_, err = stmtIns.Exec(runame)
	if err != nil {
		return err
	} else {
		return nil
	}
}

func GetComments(pid int, runame string, page int, pageSize int) ([]*Comment, error) {

	start := pageSize * (page - 1)
	var query string
	var id interface{}

	if runame != "" {
		// 查找别人发给我的未读消息
		query = `SELECT comments.id,comments.content,comments.time,comments.pid,comments.rid,comments.runame,users.id,users.name,users.qq FROM comments INNER JOIN users ON comments.uid = users.id 
		WHERE comments.runame=$1 AND read = 0 ORDER BY time DESC LIMIT $2 OFFSET $3`
		id = runame
	} else {
		// 查找 pid 的消息
		query = `SELECT comments.id,comments.content,comments.time,comments.pid,comments.rid,comments.runame,users.id,users.name,users.qq FROM comments INNER JOIN users ON comments.uid = users.id 
		WHERE comments.pid=$1 ORDER BY time DESC LIMIT $2 OFFSET $3`
		id = pid
	}

	stmtOut, err := dbConn.Prepare(query)

	if err != nil {
		return nil, err
	}

	var res []*Comment

	rows, err := stmtOut.Query(id, pageSize, start)
	if err != nil {
		return res, err
	}
	defer stmtOut.Close()
	defer rows.Close()

	for rows.Next() {
		var id, pid, uid, ruid, read, rid int
		var content, ctime, uname, uqq, runame string
		if err := rows.Scan(&id, &content, &ctime, &pid, &rid, &runame, &uid, &uname, &uqq); err != nil {
			return res, err
		}

		c := &Comment{Id: id, Content: content, Time: ctime, Pid: pid, Rid: rid, Runame: runame, Uid: uid, Uname: uname, Uqq: uqq, Ruid: ruid, Read: read}
		res = append(res, c)
	}
	return res, nil

}
