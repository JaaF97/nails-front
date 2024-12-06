import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerCliente, crearCliente } from "../Services/ClienteService";

export default function Cliente({ title }) {
  let navegacion = useNavigate();

  const { id } = useParams();

  const [cliente, setCliente] = useState({
    razonSocial: "",
    celular: "",
    mail: "",
  });

  const { razonSocial, celular, mail } = cliente;

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    //console.log(id);
    if (id > 0) {
      //console.log(id);
      const resultado = await obtenerCliente(id);
      //console.log(resultado);
      setCliente(resultado);
    }
  };

  const alCambiarValor = ({ target: { name, value } }) => {
    //spread operator ... (expandir los atributos)
    setCliente({ ...cliente, [name]: value });
  };

  const registrarCliente = async (e) => {
    e.preventDefault();

    crearCliente(cliente);
    // Redirigimos a la pagina de inicio
    navegacion("/clienteList");
  };

  return (
    <div className="container">
      <div>
        <h1> Gestión de Clientes / {title} </h1>
        <hr></hr>
      </div>

      <form onSubmit={(e) => registrarCliente(e)}>
        <div className="mb-3">
          <label htmlFor="razonSocial" className="form-label">
            {" "}
            Apellido Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="razonSocial"
            name="razonSocial"
            required={true}
            value={razonSocial}
            onChange={(e) => alCambiarValor(e)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="celular" className="form-label">
            {" "}
            Celular
          </label>
          <input
            type="number"
            className="form-control"
            id="celular"
            name="celular"
            required={true}
            value={celular}
            onChange={(e) => alCambiarValor(e)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mail" className="form-label">
            {" "}
            Mail
          </label>
          <input
            type="email"
            className="form-control"
            id="mail"
            name="mail"
            value={mail}
            onChange={(e) => alCambiarValor(e)}
          />
        </div>

        <div className="row d-md-flex justify-content-md-end">
          <div className="col-4">
            <button type="submit" className="btn btn-success btn-sm me-3">
              Guardar
            </button>
          </div>
          <div className="col-4">
            <a href="/clienteList" className="btn btn-info btn-sm me-3">
              Regresar
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
