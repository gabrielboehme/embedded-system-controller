package server

import (
	"github.com/gorilla/mux"

	"controller/internal/api"
)

func RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/configs", api.GetConfigs).Methods("GET")
	router.HandleFunc("/configs/{device_id}", api.GetConfig).Methods("GET")
	// Routes with path variables
	router.HandleFunc("/configs", api.CreateConfig).Methods("POST")
	router.HandleFunc("/configs/{device_id}", api.UpdateDeviceConfig).Methods("PATCH")
	//router.HandleFunc("/scooter/{serial_number}", api.DeleteScooter).Methods("DELETE")
	//
	//// Specific routes
	//router.HandleFunc("/scooter/{serial_number}/location", api.GetLocation).Methods("GET")
	//router.HandleFunc("/scooter/{serial_number}/location", api.UpdateLocation).Methods("PATCH")
	//
	//// Routes with path variables should come before more general routes.
	//// Be careful with the order and how you define your routes with path variables.
	//// Ensure that they don't overlap with other routes.
	//
	//// Other routes
	//router.HandleFunc("/scooter", api.CreateScooter).Methods("POST")
}
