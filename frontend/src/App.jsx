import { useEffect, useState } from "react";
import { getGarbageRequests } from "./api";

function App() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getGarbageRequests().then(setRequests);
  }, []);

  return (
    <div>
      <h1>Garbage Collection Requests</h1>
      <ul>
        {requests.map((req) => (
          <li key={req.id}>Request {req.id}: {req.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
