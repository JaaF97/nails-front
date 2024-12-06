import axios from "axios";
import { API_URL } from "../App.config";

// Obtener una lista paginada de articulos
export async function obtenerArticulosVenta(consulta, page, pageSize) {
  const urlBase = API_URL + "/articulosPageQuery";
  try {
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}?consulta=${consulta}&page=${page}&size=${pageSize}`,
    });
    return data;
  } catch (error) {
    console.error("Error al buscar articulos", error);
    throw error;
  }
}

// Obtener un articulo
export async function obtenerArticuloVenta(id) {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/articulos/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error al buscar un articulo", error);
    throw error;
  }
}

// Crear/editar un articulo
export async function crearArticuloVenta(articulo) {
  try {
    if (articulo.id > 0) {
      //window.alert("entra por el put");
      const { data } = await axios({
        method: "PUT",
        url: `${API_URL}/articulos/${articulo.id}`,
        data: articulo,
      });
      return data;
    } else {
      //window.alert("entra por el post");
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/articulos`,
        data: articulo,
      });
      return data;
    }
  } catch (error) {
    console.error("Error al crear/editar el articulo", error);
    throw error;
  }
}

// Eliminar un articulo
export async function eliminarArticuloVenta(id) {
  const urlBase = API_URL + "/articuloEliminar";
  try {
    const { data } = await axios({
      method: "DELETE",
      url: `${urlBase}/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error al eliminar el articulo", error);
    throw error;
  }
}
