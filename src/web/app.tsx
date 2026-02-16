import { Route, Switch } from "wouter";
import Index from "./pages/index";
import Systems from "./pages/systems";
import Impact from "./pages/impact";
import Venture from "./pages/venture";
import Collaborate from "./pages/collaborate";
import Admin from "./pages/admin";
import Recognition from "./pages/recognition";
import RecognitionDetail from "./pages/recognition-detail";
import { Provider } from "./components/provider";

function App() {
        return (
                <Provider>
                        <Switch>
                                <Route path="/" component={Index} />
                                <Route path="/systems" component={Systems} />
                                <Route path="/impact" component={Impact} />
                                <Route path="/venture" component={Venture} />
                                <Route path="/collaborate" component={Collaborate} />
                                <Route path="/admin" component={Admin} />
                                <Route path="/recognition" component={Recognition} />
                                <Route path="/recognition/:slug" component={RecognitionDetail} />
                        </Switch>
                </Provider>
        );
}

export default App;
