package model

import (
	"controller/internal/processors"
	"controller/internal/util"
	"fmt"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"net/http"
	"time"
)

var DB *gorm.DB

type DeviceConfig struct {
	ID          *uuid.UUID `gorm:"unique;not null;default:gen_random_uuid()" json:"id"`
	DeviceId    *uuid.UUID `gorm:"type:uuid;primaryKey; uniqueIndex; not null; default:gen_random_uuid()" json:"serial_number"`
	TargetRest  *int       `json:"target_rest"`
	TargetFinal *int       `json:"target_final"`
	CoolDown    *int       `json:"cooldown"`
	CreatedAt   *time.Time `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
}

func InitDB(dataSourceName string) error {
	var err error

	DB, err = gorm.Open(postgres.Open(dataSourceName), &gorm.Config{})
	if err != nil {
		return err
	}

	err = DB.AutoMigrate(&DeviceConfig{})
	if err != nil {
		return err
	}

	return nil
}

func (c *DeviceConfig) ValidateData() error {
	if c.ID != nil {
		return fmt.Errorf("cannot set 'id' field")
	}
	if c.DeviceId != nil {
		return fmt.Errorf("cannot set 'device_id' field")
	}
	if c.TargetRest == nil {
		return fmt.Errorf("field 'target_rest' cannot be empty")
	}

	if c.TargetFinal == nil {
		return fmt.Errorf("field 'target_final' cannot be empty")
	}

	if c.CoolDown == nil {
		return fmt.Errorf("field 'cooldown' cannot be empty")
	}

	deviceConfigExists := DeviceConfig{}
	if err := DB.Where("device_id = ?", c.DeviceId).First(&deviceConfigExists).Error; err == nil {
		// A scooter with the same id already exists, respond with an error
		return fmt.Errorf("A device with this ID already exists")
	}
	return nil
}

func (c *DeviceConfig) UpdateDeviceConfig(deviceConfigUpdated *DeviceConfigUpdate) error {
	if *deviceConfigUpdated.TargetRest > 50 || *deviceConfigUpdated.TargetRest < 0 {
		return fmt.Errorf("target_rest must be between 0 and 50.")
	}
	return nil
}

func GetDeviceConfigOr404(deviceId string, w http.ResponseWriter, r *http.Request) *DeviceConfig {
	deviceConfig := DeviceConfig{}
	deviceUUID, err := util.StringToUUID(deviceId)
	if err != nil {
		processors.RespondError(w, http.StatusNotFound, "device_id is not a valid UUID.")
		return nil
	}
	if err := DB.First(&deviceConfig, DeviceConfig{DeviceId: deviceUUID}).Error; err != nil {
		processors.RespondError(w, http.StatusNotFound, err.Error())
		return nil
	}
	return &deviceConfig
}
