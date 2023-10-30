package db

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"
)

func AddPost(title string, content string, status string, sort string, tag string, uid int, videos string) (*Post, error) {
	cstZone := time.FixedZone("CST", 8*3600)
	ctime := time.Now().In(cstZone).Format("2006-01-02 15:04")
	stmtIns, err := dbConn.Prepare("INSERT INTO posts (title,content,status,sort,tag,time,uid,videos) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)")
	if err != nil {
		return nil, err

	}
	_, err = stmtIns.Exec(title, content, status, sort, tag, ctime, uid, videos)
	if err != nil {
		return nil, err
	}
	res := &Post{Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Uid: uid, Videos: videos}
	defer stmtIns.Close()

	return res, err
}

func UpdatePost(id int, title string, content string, status string, sort string, tag string, time string, videos string) (*Post, error) {
	stmtIns, err := dbConn.Prepare("UPDATE posts SET title=$1,content=$2,status=$3,sort=$4,tag=$5,time=$6,videos=$7 WHERE id =$8")
	if err != nil {
		return nil, err

	}
	_, err = stmtIns.Exec(&title, &content, &status, &sort, &tag, &time, &videos, &id)
	if err != nil {
		return nil, err
	}
	res := &Post{Id: id, Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: time, Videos: videos}
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
	stmt, err := dbConn.Prepare(`SELECT posts.id,posts.title,posts.content,posts.status,posts.sort,posts.tag,posts.time,posts.videos,users.id,users.name,users.qq FROM posts 
INNER JOIN users ON posts.uid = users.id WHERE posts.id = $1`)
	if err != nil {
		return nil, err
	}
	var pid, uid int
	var title, content, status, sort, tag, ctime, uname, uqq, videos string

	err = stmt.QueryRow(id).Scan(&pid, &title, &content, &status, &sort, &tag, &ctime, &videos, &uid, &uname, &uqq)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if err == sql.ErrNoRows {
		return nil, nil
	}
	defer stmt.Close()

	res := &Post{Id: pid, Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Videos: videos, Uid: uid, Uname: uname, Uqq: uqq}

	return res, nil
}

func GetPosts(page int, pageSize int, status string, sort string, tag string, uid int) ([]*Post, error) {
	start := pageSize * (page - 1)
	tags := strings.Fields(tag)

	var query string
	var slice []interface{}
	if status != "" {
		slice = append(slice, status)
		query += fmt.Sprintf(" AND posts.status =$%d", len(slice))
	}

	if sort != "" {
		slice = append(slice, sort)
		query += fmt.Sprintf(" AND posts.sort =$%d", len(slice))
	}

	if uid != 0 {
		slice = append(slice, uid)
		query += fmt.Sprintf(" AND posts.uid =$%d", len(slice))
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

	sqlRaw := fmt.Sprintf("SELECT posts.id,posts.title,posts.content,posts.status,posts.sort,posts.tag,posts.time,posts.videos,users.id,users.name,users.qq FROM posts LEFT JOIN users ON posts.uid = users.id WHERE 1=1 %v ORDER BY time DESC LIMIT $%v OFFSET $%v", query, len(slice)+1, len(slice)+2)

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
		var id, uid int
		var title, content, status, sort, tag, ctime, uname, uqq, videos string
		if err := rows.Scan(&id, &title, &content, &status, &sort, &tag, &ctime, &videos, &uid, &uname, &uqq); err != nil {
			log.Println(err)
			return res, err
		}
		c := &Post{Id: id, Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Videos: videos, Uid: uid, Uname: uname, Uqq: uqq}
		res = append(res, c)
	}

	return res, nil

}

func SearchPosts(key string) ([]*Post, error) {
	key = string("%" + key + "%")
	stmt, err := dbConn.Prepare("SELECT posts.id, posts.title, posts.content, posts.status, posts.sort, posts.tag, posts.time,posts.videos, users.id, users.name, users.qq FROM posts LEFT JOIN users ON posts.uid = users.id WHERE status = 'public' AND (title LIKE $1 OR content LIKE $2) ORDER BY time DESC")

	var res []*Post

	rows, err := stmt.Query(key, key)
	if err != nil {
		return res, err
	}

	defer rows.Close()

	defer stmt.Close()

	for rows.Next() {
		var id, uid int
		var title, content, status, sort, tag, ctime, uname, uqq, videos string
		if err := rows.Scan(&id, &title, &content, &status, &sort, &tag, &ctime, &videos, &uid, &uname, &uqq); err != nil {
			return res, err
		}

		c := &Post{Id: id, Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Videos: videos, Uid: uid, Uname: uname, Uqq: uqq}
		res = append(res, c)
	}

	return res, nil
}

func FollowPosts(fid int) ([]*Post, error) {
	stmt, err := dbConn.Prepare("SELECT posts.id, posts.title, posts.content, posts.status, posts.sort, posts.tag, posts.time,posts.videos, users.id, users.name, users.qq FROM posts LEFT JOIN users ON posts.uid = users.id WHERE posts.uid in (SELECT fan.follow FROM fan WHERE fan.uid=$1) AND posts.status='public' ORDER BY posts.time DESC LIMIT 40")

	var res []*Post

	rows, err := stmt.Query(fid)
	if err != nil {
		return res, err
	}

	defer rows.Close()

	defer stmt.Close()

	for rows.Next() {
		var id, uid int
		var title, content, status, sort, tag, ctime, uname, uqq, videos string
		if err := rows.Scan(&id, &title, &content, &status, &sort, &tag, &ctime, &videos, &uid, &uname, &uqq); err != nil {
			return res, err
		}

		c := &Post{Id: id, Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Videos: videos, Uid: uid, Uname: uname, Uqq: uqq}
		res = append(res, c)
	}

	return res, nil
}

func GetRank(day string) ([]*Post, error) {

	stmt, err := dbConn.Prepare("SELECT posts.id, posts.title, posts.content, posts.status, posts.sort, posts.tag, posts.time, posts.videos FROM posts JOIN pv ON posts.id = pv.pid WHERE time >= current_timestamp - interval '1 day' * $1 ORDER BY pv DESC LIMIT 10")

	var res []*Post

	rows, err := stmt.Query(day)
	if err != nil {
		return res, err
	}

	defer rows.Close()

	defer stmt.Close()

	for rows.Next() {
		var id int
		var title, content, status, sort, tag, ctime, videos string
		if err := rows.Scan(&id, &title, &content, &status, &sort, &tag, &ctime, &videos); err != nil {
			return res, err
		}

		c := &Post{Id: id, Title: title, Content: content, Status: status, Sort: sort, Tag: tag, Time: ctime, Videos: videos}
		res = append(res, c)
	}

	return res, nil
}
