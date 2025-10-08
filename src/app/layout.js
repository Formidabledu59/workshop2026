'use client'

import "./globals.css";
import { useEffect } from "react";


export default function RootLayout({ children }) {

  useEffect(() => {
    setInterval(() => {
      const dateTime = getDateTime();
      // Update all time elements
      const timeElements = document.querySelectorAll('#statusTime, #lockTime, .time');
      timeElements.forEach(el => el.textContent = dateTime.timeStr);
  
      const dateElements = document.querySelectorAll('#lockDate');
      dateElements.forEach(el => el.textContent = dateTime.dateStr);
    }, 1000);
  }, []);


  return (
    <html lang="en">
      <body>
        {/* Status Bar Mobile */}
        <div className="status-bar">
            <span className="time" id="statusTime">14:00</span>
            <div className="status-right">
                <span className="signal">●●●●</span>
                <span className="wifi">📶</span>
                <span className="battery">87%</span>
            </div>
        </div>
        {children}
      </body>
    </html>
  );
}

function getDateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
  });
  const dateStr = now.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
  });
  return {timeStr: timeStr, dateStr: dateStr};
}