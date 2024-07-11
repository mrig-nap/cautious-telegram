import "@/styles/globals.css";
import { SocketProvider } from '../contexts/SocketContext';

export default function App({ Component, pageProps }) {
  return(
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  ) 
}
