package db

import (
	_ "database/sql"
	"time"
)

func AddComment(pos string, content string, pid int, uid int, rid int, ruid int, read int) (*Comment, error) {
	t := time.Now()
	ctime := t.Format("2006-01-02 15:04")
	stmtIns, err := dbConn.Prepare("INSERT INTO comments (pos,content,time,pid,uid,rid,ruid,read) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(pos, content, ctime, pid, uid, rid, ruid, read)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Comment{Pos: pos, Content: content, Time: ctime, Uid: uid, Pid: pid, Rid: rid, Ruid: ruid, Read: read}
	return res, err
}

func GetComments(pid int, ruid int, rid int, page int, pageSize int) ([]*Comment, error) {

	start := pageSize * (page - 1)
	var query string
	var id int

	if ruid != 0 {
		// 查找别人发给我的未读消息
		query = `SELECT comments.id,comments.pos,comments.content,comments.time,comments.pid,comments.rid,users.id,users.name,users.qq FROM comments INNER JOIN users ON comments.uid = users.id 
		WHERE comments.ruid=$1 AND read = 0 ORDER BY time DESC LIMIT $2 OFFSET $3`
		id = ruid
	} else if rid == 0 {
		// 查找 pid 的消息
		query = `SELECT comments.id,comments.pos,comments.content,comments.time,comments.pid,comments.rid,users.id,users.name,users.qq FROM comments INNER JOIN users ON comments.uid = users.id 
		WHERE comments.pid=$1 ORDER BY time DESC LIMIT $2 OFFSET $3`
		id = pid
	} else if pid == 0 {
		// 查找 rid 的消息
		query = `SELECT comments.id,comments.pos,comments.content,comments.time,comments.pid,comments.rid,users.id,users.name,users.qq FROM comments INNER JOIN users ON comments.uid = users.id 
		WHERE comments.rid=$1 ORDER BY time DESC LIMIT $2 OFFSET $3`
		id = rid
	}

	// query = `SELECT comments.id,comments.pos,comments.content,comments.time,comments.pid,comments.rid,users.id,users.name,users.qq FROM comments INNER JOIN users ON comments.uid = users.id
	// 	WHERE comments.pid=$1 OR comments.uid =$2 OR comments.rid =$3 ORDER BY time DESC LIMIT $4 OFFSET $5`

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
		var content, ctime, uname, uqq, pos string
		if err := rows.Scan(&id, &pos, &content, &ctime, &pid, &rid, &uid, &uname, &uqq); err != nil {
			return res, err
		}

		c := &Comment{Id: id, Pos: pos, Content: content, Time: ctime, Pid: pid, Rid: rid, Uid: uid, Uname: uname, Uqq: uqq, Ruid: ruid, Read: read}
		res = append(res, c)
	}
	return res, nil

}
