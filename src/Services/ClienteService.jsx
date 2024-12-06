import axios from "axios";
import { API_URL } from "../App.config";

// Obtener una lista paginada de clientes
export async function obtenerClientesPorPagina(consulta, page, pageSize) {
  const urlBase = API_URL + "/clientesPageQuery";
  try {
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}?consulta=${consulta}&page=${page}&size=${pageSize}`,
    });
    return data;
  } catch (error) {
    console.error("Error al buscar clientes:", error);
    throw error;
  }
}

// Obtener una lista paginada de clientes
export async function obtenerClientes() {
  const urlBase = API_URL + "/clientes";
  try {
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}`,
    });
    return data;
  } catch (error) {
    console.error("Error al buscar clientes:", error);
    throw error;
  }
}

// Obtener un cliente
export async function obtenerCliente(id) {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/cliente/${id}`,
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error al buscar un cliente:", error);
    throw error;
  }
}

// Crear/editar un cliente
export async function crearCliente(cliente) {
  try {
    if (cliente.id > 0) {
      const { data } = await axios({
        method: "PUT",
        url: `${API_URL}/clientes/${cliente.id}`,
        data: cliente,
      });
      return data;
    } else {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/clientes`,
        data: cliente,
      });
      return data;
    }
  } catch (error) {
    console.error("Error al crear/editar el cliente", error);
    throw error;
  }
}

// Eliminar un cliente
export async function eliminarCliente(id) {
  const urlBase = API_URL + "/clienteEliminar";
  try {
    const { data } = await axios({
      method: "PUT",
      url: `${urlBase}/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error al eliminar el cliente", error);
    throw error;
  }
}
