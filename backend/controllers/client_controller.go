package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"meu-projeto/backend/models"
	"meu-projeto/backend/services"
)

type ClientController struct {
	Service *services.ClientService
}

func (controller *ClientController) Create(w http.ResponseWriter, r *http.Request) {
	var client models.Cliente
	if err := json.NewDecoder(r.Body).Decode(&client); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := controller.Service.Create(&client); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(client)
}

func (controller *ClientController) List(w http.ResponseWriter, r *http.Request) {
	clients, err := controller.Service.List()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(clients)
}

func (controller *ClientController) FindByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path[len("/clients/id/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	client, err := controller.Service.FindByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(client)
}

func (controller *ClientController) Update(w http.ResponseWriter, r *http.Request) {
	var client models.Cliente
	if err := json.NewDecoder(r.Body).Decode(&client); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := controller.Service.Update(&client); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(client)
}

func (controller *ClientController) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path[len("/clients/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	if err := controller.Service.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
