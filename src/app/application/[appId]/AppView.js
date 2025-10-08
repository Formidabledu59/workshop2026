'use client'

import { useEffect, useState } from "react";

export default function AppView({ id }) {
  const [appData, setAppData] = useState([]);
  
  
  useEffect(() => {
    fetch(`https://workshop2526.alwaysdata.net/api/app/${id}`)
      .then(response => response.json())
      .then(json => setAppData(json.app));
  }, []);
  
  
  return (
    <div>
      <span>Bienvenu sur {appData.id}</span>
      <span>type {appData.type}</span>
    </div>
  );
}
