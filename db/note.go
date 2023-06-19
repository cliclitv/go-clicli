package db

import (
	"database/sql"
	"time"
)

func AddNote(oid int, title string, content string, pid int, uid int, tag string) (*Note, error) {
	t := time.Now()
	ctime := t.Format("2006-01-02 15:04")
	stmtIns, err := dbConn.Prepare("INSERT INTO notes (oid,title,content,time,pid,uid,tag) VALUES ($1,$2,$3,$4,$5,$6,$7)")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(oid, title, content, ctime, pid, uid, tag)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Note{Oid: oid, Title: title, Content: content, Time: ctime, Pid: pid, Tag: tag, Uid: uid}
	defer stmtIns.Close()
	return res, err
}

func GetNotes(pid int, page int, pageSize int) ([]*Note, error) {
	start := pageSize * (page - 1)

	stmtOut, err := dbConn.Prepare(`SELECT notes.id,notes.oid,notes.title,notes.time,notes.pid FROM notes WHERE notes.pid=$1 ORDER BY oid LIMIT $2 OFFSET $3`)

	if err != nil {
		return nil, err
	}

	var res []*Note

	rows, err := stmtOut.Query(pid, pageSize, start)
	if err != nil {
		return res, err
	}
	defer stmtOut.Close()

	for rows.Next() {
		var id, oid, pid int
		var title, ctime string
		if err := rows.Scan(&id, &oid, &title, &ctime, &pid); err != nil {
			return res, err
		}

		c := &Note{Id: id, Oid: oid, Title: title, Time: ctime, Pid: pid}
		res = append(res, c)
	}
	return res, nil

}

func GetNote(id int) (*Note, error) {
	stmtOut, err := dbConn.Prepare(`SELECT notes.id,notes.oid,notes.title,notes.content,notes.time, notes.tag, posts.id,posts.title FROM notes INNER JOIN posts ON notes.pid=posts.id WHERE notes.id = $1`)
	if err != nil {
		return nil, err
	}
	var vid, oid, pid int
	var title, content, ctime, ptitle, tag string

	err = stmtOut.QueryRow(id).Scan(&vid, &oid, &title, &content, &ctime, &tag, &pid, &ptitle)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if err == sql.ErrNoRows {
		return nil, nil
	}
	defer stmtOut.Close()

	res := &Note{Id: vid, Oid: oid, Title: title, Content: content, Time: ctime, Pid: pid, Ptitle: ptitle, Tag: tag}

	return res, nil
}

func GetNoteByOid(pid int, oid int) (*Note, error) {
	stmtOut, err := dbConn.Prepare(`SELECT notes.id,notes.oid,notes.title,notes.content,notes.time, notes.tag, posts.id,posts.title FROM notes INNER JOIN posts ON notes.pid=posts.id WHERE (notes.pid=$1 AND notes.oid=$2)`)
	if err != nil {
		return nil, err
	}
	var vid int
	var title, content, ctime, ptitle, tag string

	err = stmtOut.QueryRow(pid, oid).Scan(&vid, &oid, &title, &content, &ctime, &tag, &pid, &ptitle)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if err == sql.ErrNoRows {
		return nil, nil
	}
	defer stmtOut.Close()

	res := &Note{Id: vid, Oid: oid, Title: title, Content: content, Time: ctime, Pid: pid, Ptitle: ptitle, Tag: tag}

	return res, nil
}

func UpdateNote(id int, oid int, title string, content string, pid int, tag string) (*Note, error) {
	t := time.Now()
	ctime := t.Format("2006-01-02 15:04")
	stmtIns, err := dbConn.Prepare("UPDATE notes SET oid=$1,title=$2,content=$3,pid=$4,tag=$5,time=$6 WHERE id =$7")
	if err != nil {
		return nil, err

	}
	_, err = stmtIns.Exec(&oid, &title, &content, &pid, &tag, &ctime, &id)
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
