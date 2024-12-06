import React, { useContext, useEffect, useState } from "react";
import { IMAGEN_EDIT, IMAGEN_DELETE, ITEMS_PER_PAGE } from "../App.config";
import { Link, useNavigate } from "react-router-dom";
import {
  obtenerArticulosVenta,
  eliminarArticuloVenta,
} from "../Services/ArticuloVentaService";
import { ArticuloVentaContext } from "../Context/ArticuloVentaContext";

export default function ListadoArticulosVenta() {
  let navegacion = useNavigate();

  const { articulos, setArticulos } = useContext(ArticuloVentaContext);

  const [consulta, setConsulta] = useState("");

  const [pagina, setPagina] = useState(0);
  const [tamañoPagina, setTamañoPagina] = useState(ITEMS_PER_PAGE);
  const [cantidadPaginas, setTotalPages] = useState(0);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  }); // Se utiliza para el orden

  useEffect(() => {
    cargarArticulos();
  }, [pagina, tamañoPagina, consulta]);

  const cambiarPagina = (newPage) => {
    setPagina(newPage);
  };

  const cargarArticulos = async () => {
    //console.log("carga " + pagina);
    obtenerArticulosVenta(consulta, pagina, tamañoPagina)
      .then((response) => {
        setArticulos(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.error("Error al obtener articulos de venta", error);
      });
  };

  const cambiarConsulta = (e) => {
    setConsulta(e.target.value);
  };

  const eliminar = async (id) => {
    try {
      const eliminacionExitosa = await eliminarArticulosVenta(id);
      if (eliminacionExitosa) {
        getDatos();
      } else {
        console.error("Error al eliminar el articulo");
      }
    } catch (error) {
      console.error("Error al eliminar el articulo:", error);
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

  const articulosFiltrados = () => {
    const sorted = [...articulos];
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
        <h1> Gestión de Articulos Venta </h1>
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
            onClick={() => cargarArticulos()}
            className="btn btn-outline-success"
            type="submit"
          >
            Buscar
          </button>
        </div>
      </div>
      <hr></hr>
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
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
            // Iteramos articulosFiltrados para mostrarlos en la tabla
            articulosFiltrados().map((articulo, indice) => (
              <tr key={indice}>
                <th scope="row">{articulo.id}</th>
                <td>{articulo.denominacion}</td>

                <td className="text-center">
                  <div>
                    <Link
                      to={`/articulo/${articulo.id}`}
                      className="btn btn-link btn-sm me-3"
                    >
                      <img
                        src={IMAGEN_EDIT}
                        style={{ width: "20px", height: "20px" }}
                      />
                      Editar
                    </Link>

                    <button
                      onClick={() => eliminar(articulo.id)}
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
          <Link to={`/articulo`} className="btn btn-success btn-sm me-3">
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
