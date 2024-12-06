import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IMAGEN_EDIT, IMAGEN_DELETE, ITEMS_PER_PAGE } from "../App.config";
import { LineaContext } from "../Context/LineaContext";
import {
  obtenerLineasPorPagina,
  eliminarLinea,
} from "../Services/LineaService";

export default function ListadoLinea() {
  let navegacion = useNavigate();
  const { lineas, setLineas } = useContext(LineaContext);

  const [consulta, setConsulta] = useState("");

  const [pagina, setPagina] = useState(0);
  const [tamañoPagina, setTamañoPagina] = useState(ITEMS_PER_PAGE);
  const [cantidadPaginas, setCantidadPaginas] = useState(0);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  }); // Se utiliza para el orden

  useEffect(() => {
    cargarLineas();
  }, [pagina, tamañoPagina, consulta]);

  const cambiarPagina = (newPage) => {
    setPagina(newPage);
  };

  const cargarLineas = async () => {
    //console.log("carga " + pagina);
    obtenerLineasPorPagina(consulta, pagina, tamañoPagina)
      .then((response) => {
        setLineas(response.content);
        setCantidadPaginas(response.totalPages);
      })
      .catch((error) => {
        console.error("Error al obtener lineas", error);
      });
  };

  const cambiarConsulta = (e) => {
    setConsulta(e.target.value);
  };

  const eliminar = async (id) => {
    try {
      const eliminacionExitosa = await eliminarLineas(id);
      if (eliminacionExitosa) {
        getDatos();
      } else {
        console.error("Error al eliminar la línea");
      }
    } catch (error) {
      console.error("Error al eliminar la línea:", error);
    }
  };

  ///////////////////////////////////////Para el orden de las tablas///////////////////////////////////////////////////
  const filtrarPorAtributo = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const lineasFiltradas = () => {
    const sorted = [...lineas];
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

  ///////////////////////////////////////Hasta aca para el orden de las tablas///////////////////////////////////////////////////

  return (
    <div className="container">
      <div>
        <h1> Gestión de Lineas </h1>
        <hr></hr>
      </div>

      <div className="row d-md-flex justify-content-md-end">
        <div className="col-5">
          <input
            id="consulta"
            name="consulta"
            className="form-control me-2"
            type="search"
            aria-label="Search"
            value={consulta}
            onChange={cambiarConsulta}
          ></input>
        </div>
        <div className="col-1">
          <button
            onClick={() => cargarLineas()}
            className="btn btn-outline-success"
            type="submit"
          >
            Buscar
          </button>
        </div>
      </div>
      <hr></hr>
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
            <th scope="col" onClick={() => filtrarPorAtributo("denominacion")}>
              Denominación
              {sortConfig.key === "denominacion" && (
                <span>
                  {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                </span>
              )}
            </th>

            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            // Iteramos lineasFiltradas para mostrarlas en la tabla
            lineasFiltradas().map((linea, indice) => (
              <tr key={indice}>
                <th scope="row">{linea.id}</th>
                <td>{linea.denominacion}</td>

                <td className="text-center">
                  <div>
                    <Link
                      to={`/linea/${linea.id}`}
                      className="btn btn-link btn-sm me-3"
                    >
                      <img
                        src={IMAGEN_EDIT}
                        style={{ width: "20px", height: "20px" }}
                      />
                      Editar
                    </Link>

                    <button
                      onClick={() => eliminar(linea.id)}
                      className="btn btn-link btn-sm me-3"
                    >
                      {" "}
                      <img
                        src={IMAGEN_DELETE}
                        style={{ width: "20px", height: "20px" }}
                      />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <div className="row d-md-flex justify-content-md-end">
        <div className="col-4">
          <Link to={`/linea`} className="btn btn-success btn-sm me-3">
            Nuevo
          </Link>
        </div>
        <div className="col-4">
          <Link to={`/`} className="btn btn-info btn-sm me-3">
            Regresar
          </Link>
        </div>
      </div>

      {/* /////////////////////// Esto se utiliza para hacer la paginacion  ///////////////////////////////// */}

      <div className="pagination d-md-flex justify-content-md-end">
        {Array.from({ length: cantidadPaginas }, (_, i) => i).map(
          (pageNumber) => (
            <a
              key={pageNumber}
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Previene el comportamiento predeterminado del enlace
                cambiarPagina(pageNumber);
              }}
            >
              | {pageNumber} |
            </a>
          )
        )}
      </div>

      {/* /////////////////////// fin de la paginacion  ///////////////////////////////// */}
    </div>
  );
}
