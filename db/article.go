package db

import (
	"database/sql"
	"time"
)

func AddArticle(oid int, title string, content string, pid int, bio string) (*Article, error) {
	t := time.Now()
	ctime := t.Format("2006-01-02 15:04")
	stmtIns, err := dbConn.Prepare("INSERT INTO articles (oid,title,content,time,pid,bio) VALUES ($1,$2,$3,$4,$5,$6)")
	if err != nil {
		return nil, err
	}
	_, err = stmtIns.Exec(oid, title, content, ctime, pid, bio)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Article{Oid: oid, Title: title, Content: content, Time: ctime, Bio: bio, Pid: pid}
	defer stmtIns.Close()
	return res, err
}

func GetArticles(pid int, page int, pageSize int) ([]*Article, error) {
	start := pageSize * (page - 1)

	stmtOut, err := dbConn.Prepare(`SELECT articles.id,articles.oid,articles.title,articles.time,articles.pid FROM articles WHERE articles.pid=$1 ORDER BY oid LIMIT $2 OFFSET $3`)

	if err != nil {
		return nil, err
	}

	var res []*Article

	rows, err := stmtOut.Query(pid, pageSize, start)
	if err != nil {
		return res, err
	}
	defer stmtOut.Close()

	for rows.Next() {
		var id, oid, pid int
		var title, ctime  string
		if err := rows.Scan(&id, &oid, &title, &ctime, &pid); err != nil {
			return res, err
		}

		c := &Article{Id: id, Oid: oid, Title: title, Time: ctime, Pid: pid}
		res = append(res, c)
	}
	return res, nil

}

func GetArticle(id int) (*Article, error) {
	stmtOut, err := dbConn.Prepare(`SELECT articles.id,articles.oid,articles.title,articles.content,articles.time, articles.bio, posts.id,posts.title FROM articles INNER JOIN posts ON articles.pid=posts.id WHERE articles.id = $1`)
	if err != nil {
		return nil, err
	}
	var vid, oid, pid int
	var title, content, ctime, ptitle, bio string

	err = stmtOut.QueryRow(id).Scan(&vid, &oid, &title, &content, &ctime, &bio,&pid, &ptitle)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if err == sql.ErrNoRows {
		return nil, nil
	}
	defer stmtOut.Close()

	res := &Article{Id: vid, Oid: oid, Title: title, Content: content, Time: ctime, Pid: pid, Ptitle: ptitle, Bio: bio}

	return res, nil
}

func UpdateArticle(id int, oid int, title string, content string, pid int, bio string) (*Article, error) {
	t := time.Now()
	ctime := t.Format("2006-01-02 15:04")
	stmtIns, err := dbConn.Prepare("UPDATE articles SET oid=$1,title=$2,content=$3,pid=$4,bio=$5,time=$6 WHERE id =$7")
	if err != nil {
		return nil, err

	}
	_, err = stmtIns.Exec(&oid, &title, &content, &pid, &bio, &ctime, &id)
	if err != nil {
		return nil, err
	}
	defer stmtIns.Close()

	res := &Article{Id: id, Oid: oid, Title: title, Content: content, Pid: pid, Bio: bio, Time: ctime}
	return res, err
}

func DeleteArticle(id int, pid int) error {
	stmtDel, err := dbConn.Prepare("DELETE FROM articles WHERE id=$1 OR pid=$2")
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