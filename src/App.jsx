import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ListadoCliente from "./Clientes/ListadoCliente";
import Cliente from "./Clientes/Cliente";
import ClienteProvider from "./Context/ClienteContext";
import Menu from "./Menu";
import ListadoLinea from "./Articulos/ListadoLinea";
import Linea from "./Articulos/Linea";
import ListadoArticulosVenta from "./Articulos/ListadoArticulosVenta";
import ArticuloVenta from "./Articulos/ArticuloVenta";
import LineaProvider from "./Context/LineaContext";
import TipoServicioProvider from "./Context/TipoServicioContext";
import TipoServicio from "./GServicios/TipoServicio";
import ListadoTipoServicio from "./GServicios/ListadoTipoServicio";
import ArticuloVentaProvider from "./Context/ArticuloVentaContext";
import ServicioProvider from "./Context/ServicioContext";
import Servicio from "./GServicios/Servicio";
import ListadoServicio from "./GServicios/ListadoServicio";

function App() {
  return (
    <div className="conteiner">
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            exact
            path="/clienteList"
            element={
              <ClienteProvider>
                <ListadoCliente />
              </ClienteProvider>
            }
          />

          <Route
            exact
            path="/cliente"
            element={
              <ClienteProvider>
                <Cliente title="Nuevo" />
              </ClienteProvider>
            }
          />
          <Route
            exact
            path="/cliente/:id"
            element={
              <ClienteProvider>
                <Cliente title="Editar" />
              </ClienteProvider>
            }
          />

          <Route
            exact
            path="/lineaList"
            element={
              <LineaProvider>
                <ListadoLinea />
              </LineaProvider>
            }
          />
          <Route
            exact
            path="/linea"
            element={
              <LineaProvider>
                <Linea title="Nuevo" />
              </LineaProvider>
            }
          />
          <Route
            exact
            path="/linea/:id"
            element={
              <LineaProvider>
                <Linea title="Editar" />
              </LineaProvider>
            }
          />

          <Route
            exact
            path="/articuloList"
            element={
              <ArticuloVentaProvider>
                <ListadoArticulosVenta />
              </ArticuloVentaProvider>
            }
          />

          <Route
            exact
            path="/articulo"
            element={
              <ArticuloVentaProvider>
                <ArticuloVenta title="Nuevo" />
              </ArticuloVentaProvider>
            }
          />
          <Route
            exact
            path="/articulo/:id"
            element={
              <ArticuloVentaProvider>
                <ArticuloVenta title="Editar" />
              </ArticuloVentaProvider>
            }
          />

          <Route
            exact
            path="/tipoServicioList"
            element={
              <TipoServicioProvider>
                <ListadoTipoServicio />
              </TipoServicioProvider>
            }
          />
          <Route
            exact
            path="/tipoServicio"
            element={
              <TipoServicioProvider>
                <TipoServicio title="Nuevo" />
              </TipoServicioProvider>
            }
          />
          <Route
            exact
            path="/tipoServicio/:id"
            element={
              <TipoServicioProvider>
                <TipoServicio title="Editar" />
              </TipoServicioProvider>
            }
          />

          <Route
            exact
            path="/servicioList"
            element={
              <ServicioProvider>
                <ListadoServicio />
              </ServicioProvider>
            }
          />
          <Route
            exact
            path="/servicio"
            element={
              <ServicioProvider>
                <Servicio title="Nuevo" />
              </ServicioProvider>
            }
          />
          <Route
            exact
            path="/servicio/:id"
            element={
              <ServicioProvider>
                <Servicio title="Editar" />
              </ServicioProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
