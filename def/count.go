package def

type Cookie struct {
	Uid  int    `json:"uid"`
	Hcy  string `json:"hcy"`
	Quqi string `json:"quqi,omitempty"`
}

type Pv struct {
	Pid int `json:"pid"`
	Pv  int `json:"pv"`
}

type Upload struct {
	Src string `json:"src"`
}

type RealVideo struct {
	Type string `json:"type"`
	Url string `json:"url"`
}