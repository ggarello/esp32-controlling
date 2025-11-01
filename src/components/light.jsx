import './light.css';
import { useESP32WS } from '../hooks/useESP32WS';

const Light = () => {
  const { url, setUrl, connected, pins, setPin, connect, disconnect, refresh } = useESP32WS();

  const pin = 2;
  const isOn = Number(pins[pin] ?? 0) === 1;

  return (
    <div className={`lightContainer ${isOn ? 'on' : 'off'}`}>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input
          placeholder="ws://192.168.0.50/ws"
          value={url || ''}
          onChange={(e)=> setUrl(e.target.value)}
          style={{flex:1, padding:'8px 10px', borderRadius:8, border:'1px solid #26304f', background:'#0e1326', color:'#e5e7eb'}}
        />
        {connected
          ? <button className="lightButton" onClick={disconnect}>Desconectar</button>
          : <button className="lightButton" onClick={()=>connect(url)}>Conectar</button>}
      </div>

      <div className='lightCircule'></div>
      <div className='lightDescription'>
        Light GPIO {pin}: { isOn ? 'Encendida' : 'Apagada' }
      </div>

      <div style={{display:'flex', gap:10, justifyContent:'center'}}>
        <button className='lightButton' onClick={()=> setPin(pin, 1)}>Encender</button>
        <button className='lightButton' onClick={()=> setPin(pin, 0)}>Apagar</button>
        <button className='lightButton' onClick={refresh}>Refrescar</button>
      </div>
    </div>
  );
};

export default Light;
