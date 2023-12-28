package db

type Pv struct {
	Pid int `json:"pid"`
	Pv  int `json:"pv"`
}

type Pea struct {
	Uid int `json:"uid"`
	Pea int `json:"pea"`
}

type Play struct {
	MType string `json:"mtype"`
	Url   string `json:"url"`
}

type Comment struct {
	Id      int        `json:"id,omitempty"`
	Pos     string     `json:"pos"`
	Content string     `json:"content"`
	Time    string     `json:"time"`
	Pid     int        `json:"pid"`
	Rid     int        `json:"rid,omitempty"`
	Ruid    int        `json:"ruid,omitempty"`
	Runame  string     `json:"runame,omitempty"`
	Read    int        `json:"read,omitempty"`
	Uid     int        `json:"uid"`
	Uname   string     `json:"uname,omitempty"`
	Uqq     string     `json:"uqq"`
	Childs  []*Comment `json:"childs"`
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
