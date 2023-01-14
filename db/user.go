package db

import (
	"database/sql"
	"github.com/cliclitv/go-clicli/util"
	"log"
)

func CreateUser(name string, pwd string, level int, qq string, desc string, vip string) error {
	pwd = util.Cipher(pwd)
	stmtIns, err := dbConn.Prepare("INSERT INTO users (name,pwd,level,qq,desc,vip) VALUES ($1,$2,$3,$4,$5,$6)")
	if err != nil {
		return err
	}

	_, err = stmtIns.Exec(name, pwd, level, qq, desc, vip)
	if err != nil {
		return err
	}
	defer stmtIns.Close()
	return nil
}

func UpdateUser(id int, name string, pwd string, level int, qq string, vip string, desc string) (*User, error) {
	vip = ""
	if pwd == "" { // 编辑状态
		stmtIns, err := dbConn.Prepare("UPDATE users SET name=$1,level=$2,qq=$3,vip=$4,desc=$5 WHERE id =$6")
		if err != nil {
			return nil, err
		}
		_, err = stmtIns.Exec(&name, &level, &qq, &vip, &desc, &id)
		if err != nil {
			return nil, err
		}

		res := &User{Id: id, Name: name, QQ: qq, Level: level, Vip: vip}
		defer stmtIns.Close()
		return res, err
	} else {
		pwd = util.Cipher(pwd)
		stmtIns, err := dbConn.Prepare("UPDATE users SET name=$1,pwd=$2,level=$3,qq=$4,desc=$5,vip=$6 WHERE id =$7")
		if err != nil {
			return nil, err
		}
		_, err = stmtIns.Exec(&name, &pwd, &level, &qq, &desc, &vip, &id)
		if err != nil {
			return nil, err
		}
		defer stmtIns.Close()

		res := &User{Id: id, Name: name, QQ: qq, Level: level, Vip: vip}
		return res, err
	}

}

func GetUser(name string, id int, qq string) (*User, error) {
	var query string
	if name != "" {
		query += `SELECT id,name,pwd,level,qq,desc,vip FROM users WHERE name = $1`
	} else if id != 0 {
		query += `SELECT id,name,pwd,level,qq,desc,vip FROM users WHERE id = $1`
	} else if qq != "" {
		query += `SELECT id,name,pwd,level,qq,desc,vip FROM users WHERE qq = $1`
	} else {
		return nil, nil
	}
	stmt, err := dbConn.Prepare(query)
	var level int
	var desc, pwd, vip string
	if name != "" {
		err = stmt.QueryRow(name).Scan(&id, &name, &pwd, &level, &qq, &desc, &vip)
	} else if id != 0 {
		err = stmt.QueryRow(id).Scan(&id, &name, &pwd, &level, &qq, &desc, &vip)
	} else {
		err = stmt.QueryRow(qq).Scan(&id, &name, &pwd, &level, &qq, &desc, &vip)
	}

	defer stmt.Close()

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if err == sql.ErrNoRows {
		return nil, nil
	}
	res := &User{Id: id, Name: name, Pwd: pwd, Level: level, QQ: qq, Desc: desc, Vip: vip}

	return res, nil
}

func GetUsers(level int, page int, pageSize int) ([]*User, error) {
	start := pageSize * (page - 1)
	var slice []interface{}
	var query string
	if level == 5 {
		query = "SELECT id, name, level, qq, desc FROM users WHERE NOT level = 1 LIMIT $1 OFFSET $2"
	} else if level > -1 && level < 5 {
		query = "SELECT id, name, level, qq, desc FROM users WHERE level = $1 LIMIT $2 OFFSET $3"
		slice = append(slice, level)
	}

	slice = append(slice, start, pageSize)
	stmt, err := dbConn.Prepare(query)

	var res []*User

	rows, err := stmt.Query(slice...)
	if err != nil {
		return res, err
	}

	for rows.Next() {
		var id, level int
		var name, desc, qq string
		if err := rows.Scan(&id, &name, &level, &qq, &desc); err != nil {
			return res, err
		}

		c := &User{Id: id, Name: name, Level: level, QQ: qq}
		res = append(res, c)
	}
	defer stmt.Close()

	return res, nil

}

func SearchUsers(key string) ([]*User, error) {
	key = string("%" + key + "%")
	stmt, err := dbConn.Prepare("SELECT id, name, level, qq, desc FROM users WHERE name LIKE $1")

	var res []*User

	rows, err := stmt.Query(key)
	if err != nil {
		return res, err
	}

	for rows.Next() {
		var id, level int
		var name, desc, qq string
		if err := rows.Scan(&id, &name, &level, &qq, &desc); err != nil {
			return res, err
		}

		c := &User{Id: id, Name: name, Level: level, QQ: qq, Desc: desc}
		res = append(res, c)
	}
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
