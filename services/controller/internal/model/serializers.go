package model

import (
	"encoding/json"
	"io"
)

type DeviceConfigUpdateDecoder struct {
	Decoder *json.Decoder
}

type DeviceConfigUpdate struct {
	TargetRest  *int `json:"target_rest"`
	TargetFinal *int `json:"target_final"`
	CoolDown    *int `json:"cooldown"`
}

func NewDeviceConfigUpdateDecoder(r io.Reader) *DeviceConfigUpdateDecoder {
	return &DeviceConfigUpdateDecoder{Decoder: json.NewDecoder(r)}
}

func (c *DeviceConfigUpdateDecoder) Decode(deviceConfigUpdated *DeviceConfigUpdate) error {
	if err := c.Decoder.Decode(deviceConfigUpdated); err != nil {
		return err
	}
	return nil
}
