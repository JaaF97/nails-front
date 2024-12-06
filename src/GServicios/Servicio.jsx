import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crearServicio, obtenerServicio } from "../Services/ServicioService";
import { obtenerClientes } from "../Services/ClienteService";
import { obtenerTiposServicios } from "../Services/TipoServicioService";
import useFormatPrice from "../hooks/useFormatPrice";
import useFormatNumber from "../hooks/useFormatNumber";

export default function Servicio({ title }) {
  let navegacion = useNavigate();
  const formatearPrecio = useFormatPrice();
  const formatearNumero = useFormatNumber();
  const { id } = useParams();

  const [servicio, setServicio] = useState({
    denominacion: "",
  });

  const [listaClientes, setListaClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [tiposServicio, setTiposServicio] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [totalServicio, setTotalServicio] = useState(0); // Estado para el total
  const [errores, setErrores] = useState({
    fecha: "",
    cliente: "",
    servicios: Array(servicios.length).fill({ tipoServicio: "", precio: "" }),
  });

  useEffect(() => {
    cargarServicios();
    cargarClientes();
    cargarTipoServicios();
  }, []);

  // Calcular el total cada vez que cambie la lista de servicios
  useEffect(() => {
    const nuevoTotal = servicios.reduce(
      (acc, servicio) => acc + (parseFloat(servicio.precio) || 0),
      0
    );
    setTotalServicio(nuevoTotal);
  }, [servicios]);

  // const cargarModel2 = async () => {
  //   if (id > 0) {
  //     const resultado = await obtenerServicio(id);
  //     setServicio(resultado);
  //     setSelectedCliente(resultado.cliente.id); // Establecer el cliente seleccionado
  //     setFecha(new Date(resultado.fechaDocumento).toISOString().split("T")[0]); // Establecer la fecha
  //     setServicios(resultado.listaItems); // Establecer los item servicios cargados
  //   }
  // };
  const cargarServicios = async () => {
    if (id > 0) {
      const resultado = await obtenerServicio(id);
      setServicio(resultado);
      setSelectedCliente(String(resultado.cliente.id)); // Convertir a string
      setFecha(new Date(resultado.fechaDocumento).toISOString().split("T")[0]);
      setServicios(resultado.listaItems);
    }
  };

  const cargarClientes = async () => {
    const resultado = await obtenerClientes();
    setListaClientes(resultado);
  };

  const cargarTipoServicios = async () => {
    const resultado = await obtenerTiposServicios();
    setTiposServicio(resultado);
  };

  const agregarServicio = () => {
    setServicios([
      ...servicios,
      { tipoServicioId: null, tipoServicio: "", precio: "", observaciones: "" },
    ]);
  };

  const quitarServicio = (index) => {
    const nuevosServicios = [...servicios];
    nuevosServicios.splice(index, 1);
    setServicios(nuevosServicios);
  };

  // const handleServicioChangeBoorar = (index, event) => {
  //   const { name, value } = event.target;
  //   const nuevosServicios = [...servicios];
  //   nuevosServicios[index] = { ...nuevosServicios[index], [name]: value };
  //   setServicios(nuevosServicios);
  // };

  const cambiarServicio = (index, event) => {
    const { name, value } = event.target;
    const nuevosServicios = [...servicios];

    if (name === "tipoServicio") {
      const tipoServicioSeleccionado = tiposServicio.find(
        (tipo) => tipo.id === parseInt(value)
      );
      if (tipoServicioSeleccionado) {
        nuevosServicios[index] = {
          ...nuevosServicios[index],
          tipoServicioId: tipoServicioSeleccionado.id,
          tipoServicio: tipoServicioSeleccionado.denominacion,
        };
      }
    } else if (name === "precio") {
      const valorNumerico =
        value === "" ? "" : parseFloat(value.replace(/[^0-9]/g, "")) || 0;
      nuevosServicios[index] = {
        ...nuevosServicios[index],
        precio: valorNumerico, // Almacenar directamente lo que el usuario ingresa
        precioFormateado:
          valorNumerico === "" ? "" : formatearNumero(valorNumerico), // Formatear solo si hay un valor
      };
    } else {
      nuevosServicios[index] = { ...nuevosServicios[index], [name]: value };
    }
    setServicios(nuevosServicios);
  };

  const registrarServicio = async (e) => {
    e.preventDefault();
    const fechaActual = new Date().toISOString().split("T")[0];

    // Validación de fecha
    if (fecha > fechaActual) {
      setErrores((prevErrores) => ({
        ...prevErrores,
        fecha: "La fecha no puede ser mayor a la actual",
      }));
      return;
    } else {
      setErrores((prevErrores) => ({ ...prevErrores, fecha: "" }));
    }

    // Validación de cliente seleccionado
    if (!selectedCliente) {
      setErrores((prevErrores) => ({
        ...prevErrores,
        cliente: "Debe seleccionar un cliente",
      }));
      return;
    } else {
      setErrores((prevErrores) => ({ ...prevErrores, cliente: "" }));
    }

    // Validación de servicios
    const nuevosServiciosErrores = servicios.map((item) => {
      const erroresItems = {};
      if (!item.tipoServicioId)
        erroresItems.tipoServicio = "Debe seleccionar un tipo de servicio";
      if (!item.precio) erroresItems.precio = "Debe ingresar un precio";
      return erroresItems;
    });

    if (nuevosServiciosErrores.some((item) => Object.keys(item).length !== 0)) {
      setErrores((prevErrores) => ({
        ...prevErrores,
        servicios: nuevosServiciosErrores,
      }));
      return;
    } else {
      setErrores((prevErrores) => ({
        ...prevErrores,
        servicios: Array(servicios.length).fill({
          tipoServicio: "",
          precio: "",
        }),
      }));
    }

    const listaItems = servicios.map((item) => ({
      tipoServicioId: item.tipoServicioId,
      precio: parseFloat(item.precio),
      observaciones: item.observaciones || "",
    }));

    const data = {
      ...servicio,
      fechaDocumento: fecha,
      cliente: selectedCliente,
      total: totalServicio,
      listaItems,
    };

    try {
      await crearServicio(data);
      navegacion("/servicioList");
    } catch (error) {
      console.error("Error al registrar el servicio:", error);
    }
  };

  return (
    <div className="container">
      <div>
        <h1>Gestión de servicio / {title}</h1>
        <hr />
      </div>

      <form onSubmit={registrarServicio}>
        <div className="mb-3">
          <div>
            <label htmlFor="listaClientes">Selecciona un cliente: </label>
            <br />
            <select
              id="listaClientes"
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
            >
              <option value="">Seleccione...</option>
              {listaClientes.map((cliente) => (
                <option key={cliente.id} value={String(cliente.id)}>
                  {cliente.razonSocial}
                </option>
              ))}
            </select>
            {errores.cliente && <div className="error">{errores.cliente}</div>}
          </div>

          <div>
            <label htmlFor="fecha">Fecha: </label>
            <br />
            <input
              type="date"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            {errores.fecha && <div className="error">{errores.fecha}</div>}
          </div>
        </div>

        <label>Detalle del Servicio:</label>
        <hr />

        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>Tipo de Servicio</th>
              <th>Precio</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {servicios.map((servicio, index) => (
              <tr key={index}>
                <td>
                  <select
                    name="tipoServicio"
                    value={servicio.tipoServicioId || ""}
                    onChange={(e) => cambiarServicio(index, e)}
                  >
                    <option value="">Seleccione un tipo de servicio</option>
                    {tiposServicio.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.denominacion}
                      </option>
                    ))}
                  </select>
                  {errores.servicios[index]?.tipoServicio && (
                    <div className="error">
                      {errores.servicios[index].tipoServicio}
                    </div>
                  )}
                </td>
                <td>
                  <span className="dollar-sign"> $ </span>
                  <input
                    type="text"
                    name="precio"
                    value={servicio.precioFormateado || ""}
                    onChange={(e) => cambiarServicio(index, e)}
                  />
                  {errores.servicios[index]?.precio && (
                    <div className="error">
                      {errores.servicios[index].precio}
                    </div>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    name="observaciones"
                    value={servicio.observaciones}
                    onChange={(e) => cambiarServicio(index, e)}
                  />
                </td>
                <td>
                  <button type="button" onClick={() => quitarServicio(index)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" onClick={agregarServicio}>
          Agregar Servicio
        </button>

        <div>
          <h4>Total: {formatearPrecio(totalServicio)}</h4>
        </div>

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
