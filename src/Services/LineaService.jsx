import axios from "axios";
import { API_URL } from "../App.config";

// Obtener una lista paginada de lineas
export async function obtenerLineasPorPagina(consulta, page, pageSize) {
  const urlBase = API_URL + "/lineasPageQuery";
  try {
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}?consulta=${consulta}&page=${page}&size=${pageSize}`,
    });
    return data;
  } catch (error) {
    console.error("Error al buscar lineas:", error);
    throw error;
  }
}

// Obtener todas las lineas
export async function obtenerLineas() {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/lineas`,
    });
    return data;
  } catch (error) {
    console.error("Error al buscar lineas:", error);
    throw error;
  }
}

// Obtener una linea
export async function obtenerLinea(id) {
  try {
    // `${urlBase}/${id}`
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/linea/${id}`,
    });
    //console.log(data);
    return data;
  } catch (error) {
    console.error("Error al buscar una linea:", error);
    throw error;
  }
}

// Crear/editar una linea
export async function crearLinea(linea) {
  try {
    if (linea.id > 0) {
      const { data } = await axios({
        method: "PUT",
        url: `${API_URL}/linea/${linea.id}`,
        data: linea,
      });
      return data;
    } else {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/linea`,
        data: linea,
      });
      return data;
    }
  } catch (error) {
    console.error("Error al crear/editar la linea", error);
    throw error;
  }
}

// Eliminar una linea
export async function eliminarLinea(id) {
  const urlBase = API_URL + "/lineaEliminar";
  try {
    const { data } = await axios({
      method: "PUT",
      url: `${urlBase}/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error al eliminar la linea:", error);
    throw error;
  }
}
