package db

type Pv struct {
	Pid int `json:"pid"`
	Pv  int `json:"pv"`
}

type Pea struct {
	Uid int `json:"uid"`
	Pea int `json:"pea"`
}

type Fan struct {
	From int `json:"uid"`
	To   int `json:"follow"`
}

type FanCount struct {
	Following int `json:"following"`
	Followed  int `json:"followed"`
}

type Play struct {
	MType string `json:"mtype"`
	Url   string `json:"url"`
}

type Comment struct {
	Id       int    `json:"id,omitempty"`
	Rate     int    `json:"rate"`
	Content  string `json:"content"`
	Time     string `json:"time"`
	Pid      int    `json:"pid"`
	Ptitle   string `json:"ptitle,omitempty"`
	Uid      int    `json:"uid"`
	Uname    string `json:"uname,omitempty"`
	Uqq      string `json:"uqq,omitempty"`
	Pcontent string `json:"pcontent,omitempty"`
}

type User struct {
	Id    int    `json:"id,omitempty"`
	Name  string `json:"name"`
	Pwd   string `json:"pwd,omitempty"`
	QQ    string `json:"qq"`
	Sign  string `json:"sign,omitempty"`
	Level int    `json:"level"`
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
	Videos  string `json:"videos,omitempty"`
}

type Posts struct {
	Posts []*Post `json:"posts"`
}

type Users struct {
	Users []*User `json:"users"`
}

type Comments struct {
	Comments []*Comment `json:"comments"`
}

type Note struct {
	Id      int    `json:"id,omitempty"`
	Oid     int    `json:"oid"`
	Title   string `json:"title"`
	Content string `json:"content,omitempty"`
	Time    string `json:"time"`
	Pid     int    `json:"pid"`
	Uid     int    `json:"uid,omitempty"`
	Uname   string `json:"uname,omitempty"`
	Uqq     string `json:"uqq,omitempty"`
	Tag     string `json:"tag,omitempty"`
	Info    string `json:"info,omitempty"`
}

type Notes struct {
	Notes []*Note `json:"notes"`
}
