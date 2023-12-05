package server

import (
	"github.com/gorilla/mux"

	"controller/internal/api"
)

func RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/logs/{device_id}", api.GetLogs).Methods("GET")
	router.HandleFunc("/logs", api.CreateLog).Methods("POST")
}
