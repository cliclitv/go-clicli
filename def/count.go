package def

type Play struct {
	MType  string    `json:"mtype"`
	Url string `json:"url"`
}

type Pv struct {
	Pid  int `json:"pid"`
	Pv int `json:"pv"`
}