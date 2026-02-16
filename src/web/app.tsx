import { Route, Switch } from "wouter";
import Index from "./pages/index";
import Systems from "./pages/systems";
import { Provider } from "./components/provider";

function App() {
        return (
                <Provider>
                        <Switch>
                                <Route path="/" component={Index} />
                                <Route path="/systems" component={Systems} />
                        </Switch>
                </Provider>
        );
}

export default App;
