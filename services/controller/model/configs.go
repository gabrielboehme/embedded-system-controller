package model

import (
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"time"
)

var DB *gorm.DB

type DeviceConfig struct {
	ID           *uuid.UUID `gorm:"unique;not null;default:gen_random_uuid()" json:"id"`
	SerialNumber *uuid.UUID `gorm:"type:uuid;primaryKey; uniqueIndex; not null; default:gen_random_uuid()" json:"serial_number"`
	TargetRest   *int       `json:"target_rest"`
	TargetFinal  *int       `json:"target_final"`
	CoolDown     *int       `json:"cooldown"`
	CreatedAt    *time.Time `json:"created_at"`
	UpdatedAt    *time.Time `json:"updated_at"`
}

func InitDB(dataSourceName string) error {
	var err error

	DB, err = gorm.Open(postgres.Open(dataSourceName), &gorm.Config{})
	if err != nil {
		return err
	}

	DB.AutoMigrate(&DeviceConfig{})

	return nil
}
