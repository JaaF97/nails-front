import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IMAGEN_EDIT, IMAGEN_DELETE, ITEMS_PER_PAGE } from "../App.config";
import { ClienteContext } from "../Context/ClienteContext";
import {
  obtenerClientesPorPagina,
  eliminarCliente,
} from "../Services/ClienteService";

export default function ListadoCliente() {
  let navegacion = useNavigate();
  const { clientes, setClientes } = useContext(ClienteContext);

  const [consulta, setConsulta] = useState("");

  const [pagina, setPagina] = useState(0);
  const [tamañoPagina, setTamañoPagina] = useState(ITEMS_PER_PAGE);
  const [cantidadPaginas, setCantidadPaginas] = useState(0);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  }); // Se utiliza para el orden

  useEffect(() => {
    cargarClientes();
  }, [pagina, tamañoPagina, consulta]);

  const cambiarPagina = (newPage) => {
    setPagina(newPage);
  };

  const cargarClientes = async () => {
    //console.log("carga " + pagina);
    obtenerClientesPorPagina(consulta, pagina, tamañoPagina)
      .then((response) => {
        setClientes(response.content);
        setCantidadPaginas(response.totalPages);
      })
      .catch((error) => {
        console.error("Error al obtener clientes", error);
      });
  };

  const cambiarConsulta = (e) => {
    setConsulta(e.target.value);
  };

  const editar = async (id) => {
    if (window.confirm("¿Estas seguro de que deseas editar este cliente?")) {
      navegacion(`/cliente/${id}`);
    }
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      await eliminarCliente(id);
      cargarClientes();
    }
  };

  ///////////////////////////////////////Para el orden de las tablas///////////////////////////////////////////////////

  const filtrarClientes = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const clientesFiltrados = () => {
    const sorted = [...clientes];
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
        <h1> Gestión de Clientes </h1>
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
            onClick={() => cargarClientes()}
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
            <th scope="col" onClick={() => filtrarClientes("id")}>
              #
              {sortConfig.key === "id" && (
                <span>
                  {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                </span>
              )}
            </th>
            <th scope="col" onClick={() => filtrarClientes("razonSocial")}>
              Apellido y Nombre
              {sortConfig.key === "razonSocial" && (
                <span>
                  {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                </span>
              )}
            </th>
            <th scope="col" onClick={() => filtrarClientes("celular")}>
              Cel
              {sortConfig.key === "celular" && (
                <span>
                  {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                </span>
              )}
            </th>
            <th scope="col" onClick={() => filtrarClientes("mail")}>
              Mail
              {sortConfig.key === "mail" && (
                <span>
                  {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                </span>
              )}
            </th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {
            // Iteramos clientesFIltrados para mostrarlos en la tabla
            clientesFiltrados().map((cliente, indice) => (
              <tr key={indice}>
                <th scope="row">{cliente.id}</th>
                <td>{cliente.razonSocial}</td>
                <td>{cliente.celular}</td>
                <td>{cliente.mail}</td>

                <td className="text-center">
                  <div>
                    <button
                      onClick={() => editar(cliente.id)}
                      className="btn btn-link btn-sm me-3"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => eliminar(cliente.id)}
                      className="btn btn-link btn-sm me-3"
                    >
                      {" "}
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
          <Link to={`/cliente`} className="btn btn-success btn-sm me-3">
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
