import React, { useEffect, useState } from "react";
import API from "./api/api";

function App() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    API.get("/")
      .then((res) => setMensaje(res.data.message))
      .catch(() => setMensaje(" Error al conectar con el backend"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4"> Proyecto conectado</h1>
      <p className="text-xl">{mensaje}</p>
    </div>
  );
}

export default App;
