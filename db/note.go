package db

import (
	"database/sql"
	"fmt"
	"strings"
	"time"
)

func getSuo(text string) string {
	// var reg = regexp.MustCompile(`suo(.+?)\)`) // 查找以空格开头，到行尾结束，中间不包含空格字符串
	// var a = reg.FindAllString(text, -1)
	// if len(a) > 0 {
	// 	var aa = a[0]
	// 	if len(aa) > 0 {
	// 		return aa[5:len(aa)-1]
	// 	} else {
	// 		return ""
	// 	}

	// } else {
	// 	return ""
	// }
	return text[0:200]

}

func AddNote(oid int, title string, content string, pid int, uid int, tag string) (*Note, error) {
	t := time.Now()
	ctime := t.Format("2006-01-02 15:04")
	var info = getSuo(content)
	// fmt.Println(info)
	stmtIns, err := dbConn.Prepare("INSERT INTO notes (oid,title,content,time,pid,uid,tag,info) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(oid, title, content, ctime, pid, uid, tag, info)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Note{Oid: oid, Title: title, Content: content, Time: ctime, Pid: pid, Tag: tag, Uid: uid, Info: info}
	defer stmtIns.Close()
	return res, err
}

func GetNotes(pid int, uid int, tag string, page int, pageSize int) ([]*Note, error) {
	start := pageSize * (page - 1)
	tags := strings.Fields(tag)

	var query string
	var slice []interface{}

	if uid != 0 {
		slice = append(slice, uid)
		query += fmt.Sprintf(" AND notes.uid =$%d", len(slice))
	}

	if pid != 0 {
		slice = append(slice, pid)
		query += fmt.Sprintf(" AND notes.pid =$%d", len(slice))
	}

	if len(tags) != 0 {
		query += ` AND (1=2 `
		for i := 0; i < len(tags); i++ {
			key := string("%" + tags[i] + "%")
			slice = append(slice, key)
			query += fmt.Sprintf(" OR posts.tag LIKE $%d", len(slice))
		}
		query += `)`
	}

	sqlRaw := fmt.Sprintf("SELECT notes.id,notes.oid,notes.title,notes.time,notes.pid, notes.info, users.id,users.name,users.qq,posts,tag FROM notes  LEFT JOIN posts ON notes.pid = posts.id LEFT JOIN users ON users.id = posts.uid WHERE 1=1%v ORDER BY time DESC LIMIT $%v OFFSET $%v", query, len(slice)+1, len(slice)+2)

	fmt.Println(sqlRaw)

	slice = append(slice, pageSize, start)

	stmtOut, err := dbConn.Prepare(sqlRaw)

	if err != nil {
		return nil, err
	}

	var res []*Note

	rows, err := stmtOut.Query(slice...)
	if err != nil {
		return res, err
	}
	defer rows.Close()
	defer stmtOut.Close()

	for rows.Next() {
		var id, oid, pid, uid int
		var title, ctime, info, uname, uqq, ptag string
		if err := rows.Scan(&id, &oid, &title, &ctime, &pid, &info, &uid, &uname, &uqq); err != nil {
			return res, err
		}

		c := &Note{Id: id, Oid: oid, Title: title, Time: ctime, Pid: pid, Info: info, Uid: uid, Uname: uname, Uqq: uqq, Tag: ptag}
		res = append(res, c)
	}
	return res, nil

}

func GetNote(id int) (*Note, error) {
	stmtOut, err := dbConn.Prepare(`SELECT notes.id,notes.oid,notes.title,notes.content,notes.time,notes.pid FROM notes WHERE notes.id = $1`)
	if err != nil {
		return nil, err
	}
	var vid, oid,pid int
	var title, content, ctime string

	err = stmtOut.QueryRow(id).Scan(&vid, &oid, &title, &content, &ctime,&pid)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if err == sql.ErrNoRows {
		return nil, nil
	}
	defer stmtOut.Close()

	res := &Note{Id: vid, Oid: oid, Title: title, Content: content, Time: ctime,Pid: pid}

	return res, nil
}

// func GetNoteByOid(pid int, oid int) (*Note, error) {
// 	stmtOut, err := dbConn.Prepare(`SELECT notes.id,notes.oid,notes.title,notes.content,notes.time, notes.tag, posts.id,posts.title FROM notes INNER JOIN posts ON notes.pid=posts.id WHERE (notes.pid=$1 AND notes.oid=$2)`)
// 	if err != nil {
// 		return nil, err
// 	}
// 	var vid int
// 	var title, content, ctime, ptitle, tag string

// 	err = stmtOut.QueryRow(pid, oid).Scan(&vid, &oid, &title, &content, &ctime, &tag, &pid, &ptitle)
// 	if err != nil && err != sql.ErrNoRows {
// 		return nil, err
// 	}
// 	if err == sql.ErrNoRows {
// 		return nil, nil
// 	}
// 	defer stmtOut.Close()

// 	res := &Note{Id: vid, Oid: oid, Title: title, Content: content, Time: ctime, Pid: pid, Ptitle: ptitle, Tag: tag}

// 	return res, nil
// }

func UpdateNote(id int, oid int, title string, content string, pid int, tag string) (*Note, error) {
	t := time.Now()
	ctime := t.Format("2006-01-02 15:04")
	var info = getSuo(content)
	stmtIns, err := dbConn.Prepare("UPDATE notes SET oid=$1,title=$2,content=$3,pid=$4,tag=$5,time=$6,info=$7 WHERE id =$8")
	if err != nil {
		return nil, err

	}
	_, err = stmtIns.Exec(&oid, &title, &content, &pid, &tag, &ctime, &info, &id)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Note{Id: id, Oid: oid, Title: title, Content: content, Pid: pid, Tag: tag, Time: ctime}
	return res, err
}

func DeleteNote(id int, pid int) error {
	stmtDel, err := dbConn.Prepare("DELETE FROM notes WHERE id=$1 OR pid=$2")
	if err != nil {
		return err
	}

	_, err = stmtDel.Exec(id, pid)
	if err != nil {
		return err
	}
	defer stmtDel.Close()

	return nil

}
