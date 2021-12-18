package def

type Cookie struct {
	Uid  int    `json:"uid"`
	Hcy  string `json:"hcy"`
	Quqi string `json:"quqi,omitempty"`
}

type Pv struct {
	Pid  int `json:"pid"`
	Pv int `json:"pv"`
}