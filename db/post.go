package db

import (
	"database/sql"
	"fmt"
	"strings"
	"time"
)

func AddPost(title string, content string, status string, sort string, tag string, uid int, videos string) (*Post, error) {
	cstZone := time.FixedZone("CST", 8*3600)
	ctime := time.Now().In(cstZone).Format("2006-01-02 15:04")
	pv := 1
	uv := ""
	stmtIns, err := dbConn.Prepare("INSERT INTO posts (title,content,status,sort,tag,time,uid,videos,pv,uv) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)")
	if err != nil {
		return nil, err

	}
	_, err = stmtIns.Exec(title, content, status, sort, tag, ctime, uid, videos, pv, uv)
	if err != nil {
		return nil, err
	}
	res := &Post{Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Uid: uid, Videos: videos, Pv: pv, Uv: uv}
	defer stmtIns.Close()

	return res, err
}

func UpdatePost(id int, title string, content string, status string, sort string, tag string, ctime string, videos string) (*Post, error) {
	if ctime == "" {
		cstZone := time.FixedZone("CST", 8*3600)
		ctime = time.Now().In(cstZone).Format("2006-01-02 15:04")
	}
	stmtIns, err := dbConn.Prepare("UPDATE posts SET title=$1,content=$2,status=$3,sort=$4,tag=$5,time=$6,videos=$7 WHERE id =$8")
	if err != nil {
		return nil, err

	}
	_, err = stmtIns.Exec(&title, &content, &status, &sort, &tag, &ctime, &videos, &id)
	if err != nil {
		return nil, err
	}
	res := &Post{Id: id, Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Videos: videos}
	defer stmtIns.Close()
	return res, err
}

func DeletePost(id int) error {
	stmtDel, err := dbConn.Prepare("DELETE FROM posts WHERE id=$1")
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

func GetPost(id int) (*Post, error) {
	stmt, err := dbConn.Prepare(`SELECT posts.id,posts.title,posts.content,posts.status,posts.sort,posts.tag,posts.time,posts.videos,posts.pv,posts.uv,users.id,users.name,users.qq FROM posts 
INNER JOIN users ON posts.uid = users.id WHERE posts.id = $1`)
	if err != nil {
		return nil, err
	}
	var pid, uid, pv int
	var title, content, status, sort, tag, ctime, uname, uqq, videos, uv string

	err = stmt.QueryRow(id).Scan(&pid, &title, &content, &status, &sort, &tag, &ctime, &videos, &pv, &uv, &uid, &uname, &uqq)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if err == sql.ErrNoRows {
		return nil, nil
	}
	defer stmt.Close()

	UpdatePv(pid)

	res := &Post{Id: pid, Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Videos: videos, Uid: uid, Uname: uname, Uqq: uqq, Pv: pv, Uv: uv}

	return res, nil
}

func GetPosts(page int, pageSize int, status string, sort string, tag string, uid int, uv string) ([]*Post, error) {
	start := pageSize * (page - 1)

	var query string
	var slice []interface{}

	if status != "" {
		slice = append(slice, status)
		query += fmt.Sprintf(" AND posts.status =$%d", len(slice))
	}

	if uv != "" {
		slice = append(slice, string("%"+uv+"%"))
		query += fmt.Sprintf(" AND posts.uv LIKE $%d", len(slice))
	}

	if uid != 0 {
		slice = append(slice, uid)
		query += fmt.Sprintf(" AND posts.uid =$%d", len(slice))
	}

	if sort != "" {
		sorts := strings.Split(sort, ",")
		params := make([]string, 0, len(sorts))

		for _, s := range sorts {
			slice = append(slice, s)
			params = append(params, fmt.Sprintf("$%d", len(slice)))
		}
		query += ` AND posts.sort IN (` + strings.Join(params, ", ") + `)`
	}

	if tag != "" {
		tags := strings.Split(tag, ",")
		query += ` AND (1=1`
		for _, s := range tags {
			key := string("%" + s + "%")
			slice = append(slice, key)
			query += fmt.Sprintf(" AND posts.tag LIKE $%d", len(slice))
		}
		query += `)`
	}

	sqlRaw := fmt.Sprintf("SELECT posts.id,posts.title,posts.content,posts.status,posts.sort,posts.tag,posts.time,posts.videos,posts.pv,posts.uv,users.id,users.name,users.qq FROM posts LEFT JOIN users ON posts.uid = users.id WHERE 1=1 %v ORDER BY time DESC LIMIT $%v OFFSET $%v", query, len(slice)+1, len(slice)+2)

	slice = append(slice, pageSize, start)

	stmt, err := dbConn.Prepare(sqlRaw)

	if err != nil {
		return nil, err
	}
	rows, err2 := stmt.Query(slice...)
	if err2 != nil {
		return nil, err2
	}
	defer rows.Close()
	defer stmt.Close()

	var res []*Post

	for rows.Next() {
		var id, uid, pv int
		var title, content, status, sort, tag, ctime, uname, uqq, videos, uv string
		if err := rows.Scan(&id, &title, &content, &status, &sort, &tag, &ctime, &videos, &pv, &uv, &uid, &uname, &uqq); err != nil {
			return res, err
		}
		c := &Post{Id: id, Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Videos: videos, Uid: uid, Uname: uname, Uqq: uqq, Pv: pv, Uv: uv}
		res = append(res, c)
	}

	return res, nil

}

func SearchPosts(key string) ([]*Post, error) {
	key = string("%" + key + "%")
	stmt, err := dbConn.Prepare("SELECT posts.id, posts.title, posts.content, posts.status, posts.sort, posts.tag, posts.time,posts.videos, posts.pv, posts.uv, users.id, users.name, users.qq FROM posts LEFT JOIN users ON posts.uid = users.id WHERE status = 'public' AND (title LIKE $1 OR content LIKE $2) ORDER BY time DESC")

	if err != nil {
		return nil, err
	}
	var res []*Post

	rows, err := stmt.Query(key, key)
	if err != nil {
		return res, err
	}

	defer rows.Close()

	defer stmt.Close()

	for rows.Next() {
		var id, uid, pv int
		var title, content, status, sort, tag, ctime, uname, uqq, videos, uv string
		if err := rows.Scan(&id, &title, &content, &status, &sort, &tag, &ctime, &videos, &pv, &uv, &uid, &uname, &uqq); err != nil {
			return res, err
		}

		c := &Post{Id: id, Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Videos: videos, Uid: uid, Uname: uname, Uqq: uqq, Pv: pv, Uv: uv}
		res = append(res, c)
	}

	return res, nil
}

func GetRank(day string) ([]*Post, error) {

	stmt, err := dbConn.Prepare("SELECT posts.id, posts.title, posts.content, posts.status, posts.sort, posts.tag, posts.time, posts.videos, posts.pv, posts.uv, users.id, users.name, users.qq FROM posts LEFT JOIN users ON posts.uid = users.id WHERE posts.time >= current_timestamp - interval '1 day' * $1 AND posts.status='public' AND posts.sort!='原创' ORDER BY posts.pv DESC LIMIT 10 OFFSET 0")

	if err != nil {
		return nil, err
	}
	var res []*Post

	rows, err := stmt.Query(day)
	if err != nil {
		return res, err
	}

	defer rows.Close()

	defer stmt.Close()

	for rows.Next() {
		var id, pv, uid int
		var title, content, status, sort, tag, ctime, videos, uname, uqq, uv string
		if err := rows.Scan(&id, &title, &content, &status, &sort, &tag, &ctime, &videos, &pv, &uv, &uid, &uname, &uqq); err != nil {
			return res, err
		}

		c := &Post{Id: id, Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Videos: videos, Pv: pv, Uv: uv, Uname: uname, Uqq: uqq, Uid: uid}
		res = append(res, c)
	}

	return res, nil
}

func UpdatePv(pid int) error {
	stmtCount, err := dbConn.Prepare("UPDATE posts SET pv = (COALESCE(pv, 0)+1) WHERE id = $1")
	if err != nil {
		return err
	}
	_, err = stmtCount.Exec(pid)
	if err != nil && err != sql.ErrNoRows {
		return err
	}
	defer stmtCount.Close()
	return nil
}

func UpdateUv(pid int, uv string) error {
	stmtCount, err := dbConn.Prepare("UPDATE posts SET uv = $1 WHERE id = $2")
	if err != nil {
		return err
	}
	_, err = stmtCount.Exec(uv, pid)
	if err != nil && err != sql.ErrNoRows {
		return err
	}
	defer stmtCount.Close()
	return nil
}
