package db

import (
	"database/sql"
	"time"
)

func AddComment(content string, pid int, uid int, rid int, runame string) (*Comment, error) {
	t := time.Now()
	ctime := t.Format("2006-01-02 15:04")
	stmtIns, err := dbConn.Prepare("INSERT INTO comments (content,time,pid,uid,rid,runame) VALUES ($1,$2,$3,$4,$5,$6)")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(content, ctime, pid, uid, rid, runame)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Comment{Content: content, Time: ctime, Uid: uid, Pid: pid, Rid: rid, Runame: runame}
	return res, err
}

func GetComments(pid int, runame string, page int, pageSize int) ([]*Comment, error) {

	start := pageSize * (page - 1)
	var query string
	var id interface{}

	// 查找 pid 的消息
	query = `SELECT comments.id,comments.content,comments.time,comments.pid,comments.rid,comments.runame,users.id,users.name,users.qq,users.viptime,users.level FROM comments INNER JOIN users ON comments.uid = users.id 
		WHERE comments.pid=$1 ORDER BY time DESC LIMIT $2 OFFSET $3`
	id = pid

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
		var id, pid, uid, ruid, rid, uviptime, ulevel int
		var content, ctime, uname, uqq, runame string
		if err := rows.Scan(&id, &content, &ctime, &pid, &rid, &runame, &uid, &uname, &uqq, &uviptime, &ulevel); err != nil {
			return res, err
		}

		c := &Comment{Id: id, Content: content, Time: ctime, Pid: pid, Rid: rid, Runame: runame, Uid: uid, Uname: uname, Uqq: uqq, Ruid: ruid, Uviptime: uviptime, Ulevel: ulevel}
		res = append(res, c)
	}
	return res, nil

}

func DeleteComment(id int) error {
	stmtDel, err := dbConn.Prepare("DELETE FROM comments WHERE id=$1")
	if err != nil {
		return err
	}

	_, err = stmtDel.Exec(id)
	if err != nil {
		return err
	}
	defer stmtDel.Close()

	return nil
}

func GetComment(id int) (*Comment, error) {
	stmt, err := dbConn.Prepare(`comments.id,comments.content,comments.time,comments.pid,comments.rid,comments.runame,users.id,users.name,users.qq,users.viptime,users.level FROM comments INNER JOIN users ON comments.uid = users.id WHERE posts.id = $1`)
	if err != nil {
		return nil, err
	}
	var pid, uid, ruid, rid, uviptime, ulevel int
	var content, ctime, uname, uqq, runame string

	err = stmt.QueryRow(id).Scan(&id, &content, &ctime, &pid, &rid, &runame, &uid, &uname, &uqq, &uviptime, &ulevel)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if err == sql.ErrNoRows {
		return nil, nil
	}
	defer stmt.Close()

	res := &Comment{Id: id, Content: content, Time: ctime, Pid: pid, Rid: rid, Runame: runame, Uid: uid, Uname: uname, Uqq: uqq, Ruid: ruid, Uviptime: uviptime, Ulevel: ulevel, Uv}

	return res, nil
}

func UpdateCommentUv(id int, uv string) error {
	stmtCount, err := dbConn.Prepare("UPDATE comments SET uv = $1 WHERE id = $2")
	if err != nil {
		return err
	}
	_, err = stmtCount.Exec(uv, id)
	if err != nil && err != sql.ErrNoRows {
		return err
	}
	defer stmtCount.Close()
	return nil
}
