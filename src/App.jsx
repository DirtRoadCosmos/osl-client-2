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
    ones: 0,
    twos: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    sixes: 0,
    topSubtotal: 0,
    topBonus: 0,
    topTotal: 0,
  };

  const [newPlayer, setNewPlayer] = useState(emptyPlayer);

  const handlePlayerChange = (event) => {
    const key = event.target.name;
    const value = Number(event.target.value);
    const updatedPlayer = { ...newPlayer, [key]: value };
    // Debugging code:
    console.log("updatedPlayer:", updatedPlayer);

    const topSubtotal =
      updatedPlayer.ones +
      updatedPlayer.twos +
      updatedPlayer.threes +
      updatedPlayer.fours +
      updatedPlayer.fives +
      updatedPlayer.sixes;
    const topBonus = topSubtotal >= 63 ? 35 : 0;
    const topTotal = topSubtotal + topBonus;
    // More debugging code:
    console.log(
      "topSubtotal, topBonus, topTotal:",
      topSubtotal,
      topBonus,
      topTotal
    );

    setNewPlayer({
      ...updatedPlayer,
      topSubtotal: topSubtotal,
      topBonus: topBonus,
      topTotal: topTotal,
    });
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
          value={newPlayer.ones}
          label="count and add only 1s"
          handleChange={handlePlayerChange}
        />
        <FormField
          name="twos"
          label="count and add only 2s"
          value={newPlayer["twos"]}
          handleChange={handlePlayerChange}
        />
        <FormField
          name="threes"
          label="count and add only 3s"
          value={newPlayer["threes"]}
          handleChange={handlePlayerChange}
        />
        <FormField
          name="fours"
          label="count and add only 4s"
          value={newPlayer["fours"]}
          handleChange={handlePlayerChange}
        />
        <FormField
          name="fives"
          label="count and add only 5s"
          value={newPlayer["fives"]}
          handleChange={handlePlayerChange}
        />
        <FormField
          name="sixes"
          label="count and add only 6s"
          value={newPlayer["sixes"]}
          handleChange={handlePlayerChange}
        />
        <FormField
          name="topSubtotal"
          label="Top Subtotal"
          value={newPlayer["topSubtotal"]}
        />
        <FormField
          name="topBonus"
          label="Top Bonus"
          value={newPlayer["topBonus"]}
        />
        <FormField
          name="topTotal"
          label="Top Total"
          value={newPlayer["topTotal"]}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const FormField = ({ name, label, value, handleChange }) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  const isCalculated = () => {
    return (
      label === "Top Subtotal" || label === "Top Bonus" || label === "Top Total"
    );
  };

  const handleFocus = (event) => {
    event.target.select();
  };

  return (
    <Form.Group as={Row} controlId={`formBasicField${label}`} className="mb-3">
      <Col sm={10}>
        <FloatingLabel controlId={`formBasicField${label}`} label={label}>
          <Form.Control
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
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
