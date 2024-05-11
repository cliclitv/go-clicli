package db

type Count struct {
	Uid    int    `json:"uid,omitempty"`
	Action string `json:"action,omitempty"`
	Pid    int    `json:"pid,omitempty"`
	Count  int    `json:"count"`
}

type Play struct {
	MType string `json:"mtype"`
	Url   string `json:"url"`
}

type Comment struct {
	Id      int        `json:"id,omitempty"`
	Content string     `json:"content"`
	Time    string     `json:"time"`
	Pid     int        `json:"pid"`
	Rid     int        `json:"rid,omitempty"`
	Ruid    int        `json:"ruid,omitempty"`
	Runame  string     `json:"runame,omitempty"`
	Read    int        `json:"read,omitempty"`
	Uid     int        `json:"uid,omitempty"`
	Uname   string     `json:"uname,omitempty"`
	Uqq     string     `json:"uqq,omitempty"`
	Replies []*Comment `json:"replies,omitempty"`
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
	Pv      int    `json:"sort"`
}

type Actions struct {
	Posts []*Post `json:"actions"`
}

type Action struct {
	Id       int    `json:"id,omitempty"`
	Uid      int    `json:"uid,omitempty"`
	Uname    string `json:"uname,omitempty"`
	Uqq      string `json:"uqq,omitempty"`
	Action   string `json:"action,omitempty"`
	Pid      int    `json:"pid,omitempty"`
	Ptitle   string `json:"ptitle,omitempty"`
	Pcontent string `json:"pcontent,omitempty"`
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
