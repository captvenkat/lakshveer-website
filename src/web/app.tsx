import { Route, Switch } from "wouter";
import Index from "./pages/index";
import Systems from "./pages/systems";
import Impact from "./pages/impact";
import { Provider } from "./components/provider";

function App() {
        return (
                <Provider>
                        <Switch>
                                <Route path="/" component={Index} />
                                <Route path="/systems" component={Systems} />
                                <Route path="/impact" component={Impact} />
                        </Switch>
                </Provider>
        );
}

export default App;
