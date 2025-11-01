import { useEffect, useRef, useState, useCallback } from 'react';

export function useESP32WS(initialUrl = '') {
  const [url, setUrl] = useState(initialUrl);
  const [connected, setConnected] = useState(false);
  const [pins, setPins] = useState({}); // {2:1, 4:0, ...}
  const wsRef = useRef(null);
  const hbRef = useRef(null);

  const send = useCallback((obj) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(obj));
    }
  }, []);

  const connect = useCallback((nextUrl) => {
    const target = nextUrl ?? url;
    if (!target) return;
    localStorage.setItem('esp32_ws_url', target);
    // Cierra anterior
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
    }
    const ws = new WebSocket(target);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      send({ type: 'get_states' });
      hbRef.current = setInterval(() => send({ type: 'ping', ts: Date.now() }), 15000);
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'states' && msg.pins) {
          setPins(msg.pins);
        }
        if (msg.type === 'ack_set') {
          setPins((prev) => ({ ...prev, [msg.pin]: Number(msg.value) }));
        }
      } catch {}
    };

    ws.onclose = () => {
      setConnected(false);
      if (hbRef.current) { clearInterval(hbRef.current); hbRef.current = null; }
    };

    ws.onerror = () => {
      // opcional: mostrar toast/log
    };
  }, [send, url]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('esp32_ws_url');
    if (saved) setUrl(saved);
  }, []);

  useEffect(() => () => { // cleanup al desmontar
    if (hbRef.current) clearInterval(hbRef.current);
    if (wsRef.current) wsRef.current.close();
  }, []);

  const setPin = useCallback((pin, value) => {
    send({ type: 'set_pin', pin, value: Number(value) });
  }, [send]);

  const refresh = useCallback(() => send({ type: 'get_states' }), [send]);

  return { url, setUrl, connected, pins, setPin, connect, disconnect, refresh };
}
