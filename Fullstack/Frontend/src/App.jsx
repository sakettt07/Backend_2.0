import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/jokes")
      .then((response) => {
        setJokes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <h1>This is my first full stack app </h1>
      <p>JOKES : {jokes.length}</p>
      {jokes.length > 0 && ( 
      jokes.map((joke) => (
        <div key={joke.id}>  
          <h1>{joke.name}</h1>
          <p>{joke.description}</p>
        </div>
      ))
    )}
    </>
  );
}

export default App;
