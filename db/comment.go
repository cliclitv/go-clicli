package db

import (
	_ "database/sql"
	"time"
)

func AddComment(rate int, content string, pid int, uid int, cid int) (*Comment, error) {
	t := time.Now()
	ctime := t.Format("2006-01-02 15:04")
	stmtIns, err := dbConn.Prepare("INSERT INTO comments (rate,content,time,pid,uid,cid) VALUES ($1,$2,$3,$4,$5,$6)")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(rate, content, ctime, pid, uid, cid)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Comment{Rate: rate, Content: content, Time: ctime, Uid: uid, Pid: pid, Cid: cid}
	return res, err
}

func GetComments(pid int, uid int, cid int, page int, pageSize int) ([]*Comment, error) {

	start := pageSize * (page - 1)
	var query string

	if cid == 0 {
		cid = 1 // 临时修复
	}else if pid == 0{
		pid = 1
	}

	query = `SELECT comments.id,comments.rate,comments.content,comments.time,comments.pid,comments.cid,users.id,users.name,users.qq FROM comments INNER JOIN users ON comments.uid = users.id 
		WHERE comments.pid=$1 OR comments.uid =$2 OR comments.cid =$3 ORDER BY time DESC LIMIT $4 OFFSET $5`

	stmtOut, err := dbConn.Prepare(query)


	if err != nil {
		return nil, err
	}

	var res []*Comment

	rows, err := stmtOut.Query(pid, uid, cid, pageSize, start)
	if err != nil {
		return res, err
	}
	defer stmtOut.Close()
	defer rows.Close()

	for rows.Next() {
		var id, pid, uid, rate, cid int
		var content, ctime, uname, uqq string
		if err := rows.Scan(&id, &rate, &content, &ctime, &pid, &cid, &uid, &uname, &uqq); err != nil {
			return res, err
		}

		c := &Comment{Id: id, Rate: rate, Content: content, Time: ctime, Pid: pid, Cid: cid, Uid: uid, Uname: uname, Uqq: uqq}
		res = append(res, c)
	}
	return res, nil

}

func GetAllComments(page int, pageSize int) ([]*Comment, error) {
	start := pageSize * (page - 1)
	var query string

	query = `SELECT comments.id,comments.rate,comments.content,comments.time,comments.pid,users.id,users.name,users.qq,posts.title,posts.content FROM comments INNER JOIN users ON comments.uid = users.id LEFT JOIN posts ON comments.pid = posts.id 
		WHERE  comments.rate>4 ORDER BY time DESC LIMIT $1 OFFSET $2`

	stmtOut, err := dbConn.Prepare(query)

	if err != nil {
		return nil, err
	}

	var res []*Comment

	rows, err := stmtOut.Query(pageSize, start)
	if err != nil {
		return res, err
	}
	defer stmtOut.Close()
	defer rows.Close()

	for rows.Next() {
		var id, pid, uid, rate int
		var content, ctime, uname, uqq, ptitle, pcontent string
		if err := rows.Scan(&id, &rate, &content, &ctime, &pid, &uid, &uname, &uqq, &ptitle, &pcontent); err != nil {
			return res, err
		}

		c := &Comment{Id: id, Rate: rate, Content: content, Time: ctime, Pid: pid, Uid: uid, Uname: uname, Uqq: uqq, Ptitle: ptitle, Pcontent: pcontent}
		res = append(res, c)
	}
	return res, nil

}
