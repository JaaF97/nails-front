import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMAGEN_EDIT, IMAGEN_DELETE, ITEMS_PER_PAGE } from "../App.config";
import { ServicioContext } from "../Context/ServicioContext";
import {
  eliminarServicio,
  obtenerServicios,
} from "../Services/ServicioService";
import useFormatPrice from "../hooks/useFormatPrice";
import useFormatDate from "../hooks/useFormatDate";

export default function ListadoServicio() {
  const { servicios, setServicios } = useContext(ServicioContext);
  const formatearPrecio = useFormatPrice();
  const formatearFecha = useFormatDate();

  const [consulta, setConsulta] = useState("");

  const [pagina, setPagina] = useState(0);
  const [tamañoPagina, setTamañoPagina] = useState(ITEMS_PER_PAGE);
  const [cantidadPaginas, setCantidadPaginas] = useState(0);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  }); // Se utiliza para el orden

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarServicios();
    //console.log("Servicios actualizados:", servicios); // Agrega este log para verificar los datos
  }, [pagina, tamañoPagina, consulta]);

  const cargarServicios = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await obtenerServicios(consulta, pagina, tamañoPagina);
      setServicios(response.content);
      setCantidadPaginas(response.totalPages);
    } catch (err) {
      setError("Error al obtener servicios");
    } finally {
      setCargando(false);
    }
  };

  const cambiarPagina = (newPage) => {
    if (newPage >= 0 && newPage < cantidadPaginas) {
      setPagina(newPage);
    }
  };

  const cambiarConsulta = (e) => {
    setConsulta(e.target.value);
  };

  // Función para editar un servicio. TO DO: Implementar edición en back
  const editar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas editar este servicio?")) {
      alert("No se puede editar el servicio");
    }
  };

  // Función para eliminar un servicio. TO DO: Implementar eliminación en back.
  const eliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      alert("No se puede eliminar el servicio");

      // Usar cuando se implemente la eliminación en back:
      // try {
      //   const eliminacionExitosa = await eliminarServicio(id);
      //   if (eliminacionExitosa) {
      //     cargarServicios();
      //   } else {
      //     console.error("Error al eliminar el servicio");
      //   }
      // } catch (error) {
      //   console.error("Error al eliminar el servicio:", error);
      // }
    }
  };

  const filtrarPorAtributo = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const serviciosFiltrados = () => {
    const sorted = [...servicios];
    if (sortConfig.key !== null) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  };

  return (
    <div className="container">
      <div>
        <h1>Gestión de servicios</h1>
        <hr />
      </div>

      <div className="row d-md-flex justify-content-md-end">
        <div className="col-5">
          <input
            id="consulta"
            name="consulta"
            className="form-control"
            type="search"
            placeholder="Buscar servicio"
            value={consulta}
            onChange={cambiarConsulta}
          />
        </div>
        <div className="col-1">
          <button
            onClick={() => cargarServicios()}
            className="btn btn-outline-success"
          >
            Buscar
          </button>
        </div>
      </div>

      <hr />

      {cargando ? (
        <div className="text-center">Cargando...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th scope="col" onClick={() => filtrarPorAtributo("id")}>
                  #
                  {sortConfig.key === "id" && (
                    <span>
                      {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                    </span>
                  )}
                </th>

                <th scope="col" onClick={() => filtrarPorAtributo("cliente")}>
                  Cliente
                  {sortConfig.key === "cliente" && (
                    <span>
                      {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                    </span>
                  )}
                </th>
                <th scope="col" onClick={() => filtrarPorAtributo("fecha")}>
                  Fecha
                  {sortConfig.key === "fecha" && (
                    <span>
                      {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                    </span>
                  )}
                </th>
                <th scope="col" onClick={() => filtrarPorAtributo("total")}>
                  Total
                  {sortConfig.key === "total" && (
                    <span>
                      {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                    </span>
                  )}
                </th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {serviciosFiltrados().map((servicio, indice) => (
                <tr key={indice}>
                  <th scope="row">{servicio.id}</th>
                  <td>{servicio.clienteRazonSocial}</td>
                  <td>{formatearFecha(servicio.fechaDocumento)}</td>
                  <td>{formatearPrecio(servicio.total)}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <button
                        onClick={() => editar(servicio.id)}
                        className="btn btn-link btn-sm me-3"
                      >
                        <img
                          src={IMAGEN_EDIT}
                          style={{ width: "20px", height: "20px" }}
                        />
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(servicio.id)}
                        className="btn btn-link btn-sm me-3"
                      >
                        <img
                          src={IMAGEN_DELETE}
                          style={{ width: "20px", height: "20px" }}
                        />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="d-md-flex justify-content-md-end">
            <button
              className="btn btn-outline-primary me-2"
              disabled={pagina === 0}
              onClick={() => cambiarPagina(pagina - 1)}
            >
              Anterior
            </button>
            <button
              className="btn btn-outline-primary"
              disabled={pagina >= cantidadPaginas - 1}
              onClick={() => cambiarPagina(pagina + 1)}
            >
              Siguiente
            </button>
          </div>

          <div className="row d-md-flex justify-content-md-end mt-3">
            <div className="col-4">
              <Link to={`/servicio`} className="btn btn-success btn-sm">
                Nuevo
              </Link>
            </div>
            <div className="col-4">
              <Link to={`/`} className="btn btn-info btn-sm">
                Regresar
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
