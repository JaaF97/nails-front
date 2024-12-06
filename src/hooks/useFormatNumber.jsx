const useFormatNumber = () => {
  const formatearNumero = (numero) => {
    if (numero === null || numero === undefined) return "";
    return new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numero);
  };

  return formatearNumero;
};

export default useFormatNumber;
