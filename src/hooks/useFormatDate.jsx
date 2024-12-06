const useFormatDate = () => {
  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const date = new Date(fecha);
    const formattedDate = date.toLocaleDateString("es-ES");

    return formattedDate;
  };

  return formatearFecha;
};

export default useFormatDate;
