import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Form,
  Button,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";
import axios from "axios";

const HomeView = () => (
  <div>
    <h2>Dashboard</h2>
    <p>Graphs and such.</p>
  </div>
);

const DisplayPlayer = ({ player }) => {
  return (
    <div>
      {Object.entries(player).map(([key, value]) => (
        <div key={key}>
          {key}: {value}
        </div>
      ))}
    </div>
  );
};

const PlayerForm = ({ onAddPlayer }) => {
  const emptyPlayer = {
    ones: "",
    twos: "",
    threes: "",
    fours: "",
    fives: "",
    sixes: "",
    topSub: "",
    topBonus: "",
    topTotal: "",
  };

  const [newPlayer, setNewPlayer] = useState(emptyPlayer);

  const handlePlayerChange = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    const updatedPlayer = { ...newPlayer, [key]: value };
    setNewPlayer(updatedPlayer);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const wasAdded = onAddPlayer(newPlayer);
    if (wasAdded) {
      setNewPlayer(emptyPlayer);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <FormField
          name="ones"
          label="1s"
          value={newPlayer["ones"]}
          handleChange={handlePlayerChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const FormField = ({ name, label, value, handleChange }) => {
  const isCalculated = () => {
    return (
      label === "Top Subtotal" || label === "Bonus" || label === "Top Total"
    );
  };

  return (
    <Form.Group as={Row} controlId={`formBasicField${label}`} className="mb-3">
      <Col sm={10}>
        <FloatingLabel controlId={`formBasicField${label}`} label={label}>
          <Form.Control
            name={name}
            value={value}
            onChange={handleChange}
            disabled={isCalculated()}
          />
        </FloatingLabel>
      </Col>
    </Form.Group>
  );
};

const YahtzeeView = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/players").then((response) => {
      setPlayers(response.data);
    });
  }, []);

  const addPlayer = (newPlayer) => {
    console.log("adding", newPlayer);
    setPlayers(players.concat(newPlayer));
    return true;
  };

  return (
    <Container>
      <PlayerForm onAddPlayer={addPlayer} />
      <div>
        {players.map((player, i) => (
          <DisplayPlayer key={i} player={player} />
        ))}
      </div>
    </Container>
  );
};

const ScrabbleView = () => (
  <div>
    <h2>OSL Scrabble</h2>
  </div>
);

const Navigation = () => (
  <Navbar bg="light" expand="md" className="mb-3">
    <Navbar.Brand as={Link} to="/">
      OSL
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        <Nav.Link as={Link} to="/">
          Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/yahtzee">
          Yahtzee
        </Nav.Link>
        <Nav.Link as={Link} to="/scrabble">
          Scrabble
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const App = () => (
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/yahtzee" element={<YahtzeeView />} />
      <Route path="/scrabble" element={<ScrabbleView />} />
    </Routes>
  </Router>
);

export default App;
