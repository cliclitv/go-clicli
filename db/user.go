package db

import (
	"database/sql"
	"log"
	"time"

	"github.com/cliclitv/go-clicli/util"
)

func CreateUser(name string, pwd string, level int, qq string, sign string) error {
	pwd = util.Cipher(pwd)
	stmtIns, err := dbConn.Prepare("INSERT INTO users (name,pwd,level,qq,sign) VALUES ($1,$2,$3,$4,$5)")
	if err != nil {
		return err
	}

	_, err = stmtIns.Exec(name, pwd, level, qq, sign)
	if err != nil {
		return err
	}
	defer stmtIns.Close()
	return nil
}

func UpdateUser(id int, name string, pwd string, level int, qq string, sign string) (*User, error) {
	cstZone := time.FixedZone("CST", 8*3600)
	ctime := time.Now().In(cstZone).Format("2006-01-02 15:04")
	if pwd == "" { // 编辑状态
		stmtIns, err := dbConn.Prepare("UPDATE users SET name=$1,level=$2,qq=$3,sign=$4,time=$5 WHERE id =$6")
		if err != nil {
			return nil, err
		}
		_, err = stmtIns.Exec(&name, &level, &qq, &sign, &ctime, &id)
		if err != nil {
			return nil, err
		}

		res := &User{Id: id, Name: name, QQ: qq, Level: level}
		defer stmtIns.Close()
		return res, err
	} else {
		pwd = util.Cipher(pwd)
		stmtIns, err := dbConn.Prepare("UPDATE users SET name=$1,pwd=$2,level=$3,qq=$4,sign=$5,time=$6 WHERE id =$7")
		if err != nil {
			return nil, err
		}
		_, err = stmtIns.Exec(&name, &pwd, &level, &qq, &sign, &ctime, &id)
		if err != nil {
			return nil, err
		}
		defer stmtIns.Close()

		res := &User{Id: id, Name: name, QQ: qq, Level: level, Time: ctime}
		return res, err
	}

}

func GetUser(name string, id int, qq string) (*User, error) {
	var query string
	if name != "" {
		query += `SELECT id,name,pwd,level,qq,sign FROM users WHERE name = $1`
	} else if id != 0 {
		query += `SELECT id,name,pwd,level,qq,sign FROM users WHERE id = $1`
	} else if qq != "" {
		query += `SELECT id,name,pwd,level,qq,sign FROM users WHERE qq = $1`
	} else {
		return nil, nil
	}
	stmt, err := dbConn.Prepare(query)

	var level int
	var sign, pwd string
	if name != "" {
		err = stmt.QueryRow(name).Scan(&id, &name, &pwd, &level, &qq, &sign)
	} else if id != 0 {
		err = stmt.QueryRow(id).Scan(&id, &name, &pwd, &level, &qq, &sign)
	} else {
		err = stmt.QueryRow(qq).Scan(&id, &name, &pwd, &level, &qq, &sign)
	}

	defer stmt.Close()

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if err == sql.ErrNoRows {
		return nil, nil
	}
	res := &User{Id: id, Name: name, Level: level, QQ: qq, Sign: sign, Pwd: pwd}

	return res, nil
}

func GetUsers(level int, page int, pageSize int) ([]*User, error) {
	start := pageSize * (page - 1)
	var slice []interface{}
	var query string
	if level == 5 {
		query = "SELECT id, name, level, qq, sign FROM users WHERE NOT level = 1 ORDER BY time DESC LIMIT $1 OFFSET $2"
	} else if level == 4 {
		query = "SELECT id, name, level, qq, sign FROM users WHERE level = $1 AND NOT sign = '' ORDER BY time DESC LIMIT $2 OFFSET $3"
		slice = append(slice, level)
	} else {
		query = "SELECT id, name, level, qq, sign FROM users WHERE level = $1 ORDER BY time DESC LIMIT $2 OFFSET $3"
		slice = append(slice, level)
	}

	slice = append(slice, pageSize, start)
	stmt, err := dbConn.Prepare(query)

	var res []*User

	rows, err := stmt.Query(slice...)
	if err != nil {
		return res, err
	}

	defer rows.Close()

	defer stmt.Close()

	for rows.Next() {
		var id, level int
		var name, sign, qq string
		if err := rows.Scan(&id, &name, &level, &qq, &sign); err != nil {
			return res, err
		}

		c := &User{Id: id, Name: name, Level: level, QQ: qq, Sign: sign}
		res = append(res, c)
	}

	return res, nil

}

func SearchUsers(key string) ([]*User, error) {
	key = string("%" + key + "%")
	stmt, err := dbConn.Prepare("SELECT id, name, level, qq, sign FROM users WHERE name LIKE $1")

	var res []*User

	rows, err := stmt.Query(key)
	if err != nil {
		return res, err
	}

	for rows.Next() {
		var id, level int
		var name, sign, qq string
		if err := rows.Scan(&id, &name, &level, &qq, &sign); err != nil {
			return res, err
		}

		c := &User{Id: id, Name: name, Level: level, QQ: qq, Sign: sign}
		res = append(res, c)
	}
	defer rows.Close()
	defer stmt.Close()

	return res, nil

}

func DeleteUser(id int) error {
	stmtDel, err := dbConn.Prepare("DELETE FROM users WHERE id =$1")
	if err != nil {
		log.Printf("%s", err)
		return err
	}
	_, err = stmtDel.Exec(id)
	if err != nil {
		return err
	}
	defer stmtDel.Close()

	return nil
}
