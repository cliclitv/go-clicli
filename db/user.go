package db

import (
	"database/sql"
	"encoding/hex"
	"github.com/cliclitv/go-clicli/util"
	"github.com/ethereum/go-ethereum/crypto"
	"log"
)

func CreateUser(name string, pwd string, level int, qq string, sign string, hash string) error {
	pwd = util.Cipher(pwd)
	stmtIns, err := dbConn.Prepare("INSERT INTO users (name,pwd,level,qq,sign,hash) VALUES ($1,$2,$3,$4,$5,$6)")
	if err != nil {
		return err
	}

	_, err = stmtIns.Exec(name, pwd, level, qq, sign, hash)
	if err != nil {
		return err
	}
	defer stmtIns.Close()
	return nil
}

func UpdateUser(id int, name string, pwd string, level int, qq string, hash string, sign string) (*User, error) {
	if pwd == "" { // 编辑状态
		if hash == "" && sign == "" {
			key, err := crypto.GenerateKey()

			if err != nil {
				return nil, err
			}

			hash = crypto.PubkeyToAddress(key.PublicKey).Hex()

			sign = hex.EncodeToString(key.D.Bytes())
		}
		stmtIns, err := dbConn.Prepare("UPDATE users SET name=$1,level=$2,qq=$3,hash=$4,sign=$5 WHERE id =$6")
		if err != nil {
			return nil, err
		}
		_, err = stmtIns.Exec(&name, &level, &qq, &hash, &sign, &id)
		if err != nil {
			return nil, err
		}

		res := &User{Id: id, Name: name, QQ: qq, Level: level, Hash: hash}
		defer stmtIns.Close()
		return res, err
	} else {
		pwd = util.Cipher(pwd)
		log.Printf("%s", id)
		stmtIns, err := dbConn.Prepare("UPDATE users SET name=$1,pwd=$2,level=$3,qq=$4,sign=$5,hash=$6 WHERE id =$7")
		if err != nil {
			return nil, err
		}
		_, err = stmtIns.Exec(&name, &pwd, &level, &qq, &sign, &hash, &id)
		if err != nil {
			return nil, err
		}
		defer stmtIns.Close()

		res := &User{Id: id, Name: name, QQ: qq, Level: level, Hash: hash}
		return res, err
	}

}

func GetUser(name string, id int, qq string) (*User, error) {
	var query string
	if name != "" {
		query += `SELECT id,name,pwd,level,qq,sign,hash FROM users WHERE name = $1`
	} else if id != 0 {
		query += `SELECT id,name,pwd,level,qq,sign,hash FROM users WHERE id = $1`
	} else {
		query += `SELECT id,name,pwd,level,qq,sign,hash FROM users WHERE qq = $1`
	}
	stmt, err := dbConn.Prepare(query)
	var level int
	var sign, pwd, hash string
	if name != "" {
		err = stmt.QueryRow(name).Scan(&id, &name, &pwd, &level, &qq, &sign, &hash)
	} else if id != 0 {
		err = stmt.QueryRow(id).Scan(&id, &name, &pwd, &level, &qq, &sign, &hash)
	} else {
		err = stmt.QueryRow(qq).Scan(&id, &name, &pwd, &level, &qq, &sign, &hash)
	}

	defer stmt.Close()

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	if err == sql.ErrNoRows {
		return nil, nil
	}
	res := &User{Id: id, Name: name, Pwd: pwd, Level: level, QQ: qq, Desc: sign, Hash: hash}

	return res, nil
}

func GetUsers(level int, page int, pageSize int) ([]*User, error) {
	start := pageSize * (page - 1)
	var slice []interface{}
	var query string
	if level == 5 {
		query = "SELECT id, name, level, qq, sign FROM users WHERE NOT level = 1 LIMIT $1 OFFSET $2"
	} else if level > -1 && level < 5 {
		query = "SELECT id, name, level, qq, sign FROM users WHERE level = $1 LIMIT $2 OFFSET $3"
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
		var name, sign, qq string
		if err := rows.Scan(&id, &name, &level, &qq, &sign); err != nil {
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

		c := &User{Id: id, Name: name, Level: level, QQ: qq, Desc: sign}
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
