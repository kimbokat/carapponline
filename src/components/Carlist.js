import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AddCar from "./AddCar";
import { API_URL } from "../constants";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import EditCar from "./EditCar";

function Carlist() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const [columnDefs] = useState([
    { field: "brand", sortable: true, filter: true },
    { field: "model", sortable: true, filter: true },
    { field: "color", sortable: true, filter: true, width: 150 },
    { field: "fuel", sortable: true, filter: true, width: 150 },
    { field: "year", sortable: true, filter: true, width: 100 },
    { field: "price", sortable: true, filter: true, width: 150 },
    {
      cellRenderer: (params) => <EditCar updateCar={updateCar} params={params.data} />,
      width: 120,
    },
    {
      cellRenderer: (params) => (
        <Button onClick={() => deleteCar(params)}>Delete</Button>
      ),
    },
  ]);

  useEffect(() => {
    getCars();
  }, []);

  const getCars = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  };
  const deleteCar = (params) => {
    if (window.confirm("Delete car?")) {
      fetch(params.data._links.car.href, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            setMsg('Car deleted successfully')
            setOpen(true);
            getCars();
          } else {
            alert("Something went wrong in deletion: " + response.status);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const addCar = (car) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(car),
    })
      .then((response) => {
        if (response.ok) getCars();
        else alert("Something went wrong when adding a new car");
      })
      .catch((err) => console.error(err));
  };

  const updateCar = (url, updatedCar) => {
    fetch(url, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(updatedCar),
    })
    
    .then(response => {
      if (response.ok) {
        setMsg('Car edited');
        setOpen(true);
        getCars();
      }
      else
        alert('Something went wrong in edit: ' + response.statusText);
    })
    .catch(err => console.error(err))
  };

  return (
    <>
      <AddCar addCar={addCar} />
      <div
        className="ag-theme-material"
        style={{ height: 600, width: "90%", margin: "auto" }}
      >
        <AgGridReact
          pagination={true}
          paginationPageSize={10}
          rowData={cars}
          columnDefs={columnDefs}
        ></AgGridReact>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message={msg}
      />
    </>
  );
}

export default Carlist;
