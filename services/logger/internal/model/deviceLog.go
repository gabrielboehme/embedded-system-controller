package model

import (
	"controller/internal/processors"
	"controller/internal/util"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"net/http"
	"time"
)

var DB *gorm.DB

type DeviceLog struct {
	ID        *uuid.UUID `gorm:"primaryKey; unique;not null;default:gen_random_uuid()" json:"id"`
	DeviceId  *uuid.UUID `gorm:"type:uuid; not null;" json:"device_id"`
	Log       *string    `gorm:"not null" json:"log"`
	CreatedAt time.Time  `gorm:"not null" json:"created_at"`
}

func InitDB(dataSourceName string) error {
	var err error

	DB, err = gorm.Open(postgres.Open(dataSourceName), &gorm.Config{})
	if err != nil {
		return err
	}

	err = DB.AutoMigrate(&DeviceLog{})
	if err != nil {
		return err
	}

	return nil
}

func GetDeviceLogsOr404(deviceId string, w http.ResponseWriter, r *http.Request) *[]DeviceLog {
	var deviceLogs []DeviceLog
	deviceUUID, err := util.StringToUUID(deviceId)
	if err != nil {
		processors.RespondError(w, http.StatusNotFound, "device_id is not a valid UUID.")
		return nil
	}
	if err := DB.Where("device_id = ?", deviceUUID).Find(&deviceLogs).Error; err != nil {
		processors.RespondError(w, http.StatusNotFound, err.Error())
		return nil
	}
	return &deviceLogs
}
