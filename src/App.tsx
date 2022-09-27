import {
  BrowserRouter as Router,
  Switch as Routes,
  Route,
} from "react-router-dom";
import Header from "./Route/Components/Header";
import Home from "./Route/Home";
import Search from "./Route/Search";
import Tv from "./Route/Tv";
import { Helmet } from "react-helmet";

function App() {
  return (
    <>
      <Helmet>
        <title>NETFILX</title>
      </Helmet>

      <Router>
        {/* <Router basename={process.env.PUBLIC_URL}> */}
        <Header />
        <Routes>
          <Route path="/tv">
            <Tv />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path={["/", "movies/:movieId"]}>
            <Home />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
