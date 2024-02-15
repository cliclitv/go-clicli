func GetFanCount(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	type, _ := strconv.Atoi(p.ByName("uid"))
	uid, _ := strconv.Atoi(p.ByName("uid"))
	
	res, err := db.GetFanCount(uid)

	if err != nil{
		sendMsg(w, 500, fmt.Sprintf("%s", err))
	}
	
	sendFansResponse(w, res, 200)

}