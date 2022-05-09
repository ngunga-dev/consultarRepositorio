import React from "react";
import { BrowserRouter,Switch,Route } from "react-router-dom";
import Main from "./pages/Main";
import Repositorio from "./pages/Repositorio";
const Rotas = () => {
    return(
    <BrowserRouter>
    <Switch>
        <Route path="/" component={Main} exact />
        <Route path="/repositorio/:repositorio" component={Repositorio} />
    </Switch>
    </BrowserRouter>
    )
}

export default Rotas;
