const useFormatPrice = () => {
  const formatearPrecio = (precio) => {
    if (!precio) return "";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(precio);
  };
  return formatearPrecio;
};

export default useFormatPrice;
