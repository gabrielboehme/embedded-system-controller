package api

import (
	"controller/internal/model"
	"controller/internal/processors"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

func GetConfig(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	deviceID := vars["device_id"]
	deviceConfig := model.GetDeviceConfigOr404(deviceID, w, r)
	if deviceConfig == nil {
		return
	}
	processors.RespondJSON(w, http.StatusOK, deviceConfig)
}

func CreateConfig(w http.ResponseWriter, r *http.Request) {
	deviceConfig := model.DeviceConfig{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&deviceConfig); err != nil {
		processors.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := deviceConfig.ValidateData(); err != nil {
		processors.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := model.DB.Create(&deviceConfig).Error; err != nil {
		processors.RespondError(w, http.StatusInternalServerError, "internal server error")
		fmt.Printf(err.Error())
		return
	}
	processors.RespondJSON(w, http.StatusCreated, deviceConfig)
}

func UpdateDeviceConfig(w http.ResponseWriter, r *http.Request) {
	// Updates DeviceConfig Fields:
	// TargetRest
	// TargetFinal
	// CoolDown
	vars := mux.Vars(r)
	deviceID := vars["device_id"]
	deviceConfig := model.GetDeviceConfigOr404(deviceID, w, r)
	if deviceConfig == nil {
		return
	}

	var configUpdated model.DeviceConfigUpdate
	decoder := model.NewDeviceConfigUpdateDecoder(r.Body)
	if err := decoder.Decode(&configUpdated); err != nil {
		processors.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	// Tries to update scooter
	if err := deviceConfig.UpdateDeviceConfig(&configUpdated); err != nil {
		processors.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := model.DB.Save(&deviceConfig).Error; err != nil {
		processors.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	processors.RespondJSON(w, http.StatusOK, deviceConfig)

}
