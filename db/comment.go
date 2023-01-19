package db

import (
	_ "database/sql"
	"time"
)

func AddComment(rate int, content string, pid int, uid int) (*Comment, error) {
	t := time.Now()
	ctime := t.Format("2006-01-02 15:04")
	stmtIns, err := dbConn.Prepare("INSERT INTO comments (rate,content,time,pid,uid) VALUES ($1,$2,$3,$4,$5)")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(rate, content, ctime, pid, uid)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Comment{Rate: rate, Content: content, Time: ctime, Uid: uid, Pid: pid}
	return res, err
}

func GetComments(pid int, uid int, page int, pageSize int) ([]*Comment, error) {
	start := pageSize * (page - 1)

	stmtOut, err := dbConn.Prepare(`SELECT comments.id,comments.rate,comments.content,comments.time,comments.pid,users.id,users.name,users.qq FROM comments INNER JOIN users ON comments.uid = users.id 
WHERE comments.pid=$1 OR comments.uid =$2 ORDER BY id,uid limit $3,$4`)

	if err != nil {
		return nil, err
	}

	var res []*Comment

	rows, err := stmtOut.Query(pid, uid, start, pageSize)
	if err != nil {
		return res, err
	}
	defer stmtOut.Close()
	defer rows.Close()

	for rows.Next() {
		var id, pid, uid, rate int
		var content, ctime, uname, uqq string
		if err := rows.Scan(&id, &rate, &content, &ctime, &pid, &uid, &uname, &uqq); err != nil {
			return res, err
		}

		c := &Comment{Id: id, Rate: rate, Content: content, Time: ctime, Pid: pid, Uid: uid, Uname: uname, Uqq: uqq}
		res = append(res, c)
	}
	return res, nil

}

// func GetVideo(id int) (*def.Video, error) {
// 	stmtOut, err := dbConn.Prepare(`SELECT comments.id,comments.oid,comments.title,comments.content,comments.time,posts.id,posts.title,users.id,users.name,users.qq FROM (comments INNER JOIN posts ON comments.pid=posts.id)
// INNER JOIN users ON comments.uid = users.id WHERE comments.id = ?`)
// 	if err != nil {
// 		return nil, err
// 	}
// 	var vid, uid, oid, pid int
// 	var title, content, ctime, uname, uqq, ptitle string

// 	err = stmtOut.QueryRow(id).Scan(&vid, &oid, &title, &content, &ctime, &pid, &ptitle, &uid, &uname, &uqq)
// 	if err != nil && err != sql.ErrNoRows {
// 		return nil, err
// 	}
// 	if err == sql.ErrNoRows {
// 		return nil, nil
// 	}
// 	defer stmtOut.Close()

// 	res := &def.Video{Id: vid, Oid: oid, Title: title, Content: content, Time: ctime, Pid: pid, Ptitle: ptitle, Uid: uid, Uname: uname, Uqq: uqq}

// 	return res, nil
// }

// func UpdateVideo(id int, oid int, title string, content string, pid int, uid int) (*def.Video, error) {
// 	t := time.Now()
// 	ctime := t.Format("2006-01-02 15:04")
// 	stmtIns, err := dbConn.Prepare("UPDATE comments SET oid=?,title=?,content=?,pid=?,uid=?,time=? WHERE id =?")
// 	if err != nil {
// 		return nil, err

// 	}
// 	_, err = stmtIns.Exec(&oid, &title, &content, &pid, &uid, &ctime, &id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer stmtIns.Close()

// 	res := &def.Video{Id: id, Oid: oid, Title: title, Content: content, Pid: pid, Uid: uid, Time: ctime}
// 	return res, err
// }

// func DeleteVideo(id int, pid int) error {
// 	stmtDel, err := dbConn.Prepare("DELETE FROM comments WHERE id=? OR pid=?")
// 	if err != nil {
// 		return err
// 	}

// 	_, err = stmtDel.Exec(id, pid)
// 	if err != nil {
// 		return err
// 	}
// 	defer stmtDel.Close()

// 	return nil

// }
