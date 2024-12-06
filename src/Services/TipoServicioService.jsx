import axios from "axios";
import { API_URL } from "../App.config";

// Obtener una lista paginada de tipos de servicios
export async function obtenerTiposServiciosPorPagina(consulta, page, pageSize) {
  const urlBase = API_URL + "/tiposServiciosPageQuery";
  try {
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}?consulta=${consulta}&page=${page}&size=${pageSize}`,
    });
    return data;
  } catch (error) {
    console.error("Error al buscar tipos de servicios", error);
    throw error;
  }
}

// Obtener una lista de tipos de servicios
export async function obtenerTiposServicios() {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/tiposServicios`,
    });
    return data;
  } catch (error) {
    console.error("Error al buscar tipos de servicios", error);
    throw error;
  }
}

// Obtener un tipo de servicio
export async function obtenerTipoServicio(id) {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/tiposServicios/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error al buscar un tipo servicio", error);
    throw error;
  }
}

// Crear o actualizar un tipo de servicio
export async function crearTipoServicio(tipoServicio) {
  try {
    if (tipoServicio.id > 0) {
      const { data } = await axios({
        method: "PUT",
        url: `${API_URL}/tiposServicios/${tipoServicio.id}`,
        data: tipoServicio,
      });
      return data;
    } else {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/tiposServicios`,
        data: tipoServicio,
      });
      return data;
    }
  } catch (error) {
    console.error("Error al crear/editar el tipo de servicio", error);
    throw error;
  }
}

// Eliminar un tipo de servicio
export async function eliminarTipoServicio(id) {
  const urlBase = API_URL + "/tipoServicioEliminar";
  try {
    const { data } = await axios({
      method: "PUT",
      url: `${urlBase}/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error al eliminar el tipo de servicio", error);
    throw error;
  }
}
