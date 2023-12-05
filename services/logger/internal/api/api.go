package api

import (
	"controller/internal/model"
	"controller/internal/processors"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

func GetLogs(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	deviceID := vars["device_id"]
	deviceLogs := model.GetDeviceLogsOr404(deviceID, w, r)
	if deviceLogs == nil {
		return
	}
	processors.RespondJSON(w, http.StatusOK, deviceLogs)
}

func CreateLog(w http.ResponseWriter, r *http.Request) {
	deviceLog := model.DeviceLog{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&deviceLog); err != nil {
		processors.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := model.DB.Create(&deviceLog).Error; err != nil {
		processors.RespondError(w, http.StatusInternalServerError, "internal server error")
		fmt.Printf(err.Error())
		return
	}
	processors.RespondJSON(w, http.StatusCreated, deviceLog)
}
