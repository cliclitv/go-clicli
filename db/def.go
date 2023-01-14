package db

type Pv struct {
	Pid  int `json:"pid"`
	Pv int `json:"pv"`
}

type Play struct {
	MType  string    `json:"mtype"`
	Url string `json:"url"`
}

type User struct {
	Id    int    `json:"id,omitempty"`
	Name  string `json:"name"`
	Pwd   string `json:"pwd,omitempty"`
	QQ    string `json:"qq"`
	Sign  string `json:"sign,omitempty"`
	Level int    `json:"level"`
	Time  string `json:"time,omitempty"`
}

type Post struct {
	Id      int    `json:"id,omitempty"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Status  string `json:"status"`
	Sort    string `json:"sort"`
	Tag     string `json:"tag,omitempty"`
	Time    string `json:"time"`
	Uid     int    `json:"uid,omitempty"`
	Uname   string `json:"uname,omitempty"`
	Uqq     string `json:"uqq,omitempty"`
	Utime     string `json:"utime,omitempty"`
	Videos  string `json:"videos,omitempty"`
}

type Posts struct {
	Posts []*Post `json:"posts"`
}

type Users struct {
	Users []*User `json:"users"`
}
