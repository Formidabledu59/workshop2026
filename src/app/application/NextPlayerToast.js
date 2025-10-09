'use client'


export default function NextPlayerToast({ player }) {
  return (
    <span className="toast">
      <span className="toastColorizedTxt">{player}</span> joues !
    </span>
  );
}
