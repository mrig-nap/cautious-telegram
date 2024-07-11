import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "@mui/material";
import NameModal from "@/components/NameModal";
import { io } from "socket.io-client";
import PlayersLobby from "@/components/PlayersLobby";
import FastestFingerFirst from "@/components/FastestFingerFirst";
import MessageBox from "@/components/MessageBox";
import JoinGameModal from "@/components/JoinGameModal";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [openLobby, setOpenLobby] = useState(false);
  const [openName, setOpenName] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket)

    socket.on("connect", () => {
      console.log("Connected to server", socket.id)
    })
     
    
    return () => {
      socket.disconnect();
    }
  },[])

  if(!socket){
    return;
  }
  console.log(socket)
  socket.on("new-player-list", allPlayers => {
    console.log(allPlayers + " players joined");
    setJoinedPlayers(allPlayers)
  })

  console.log(joinedPlayers)
  return (
    <main className="background">
      <JoinGameModal socket={socket} setOpenLobby={setOpenLobby} />
      {/* <NameModal socket={socket} openName={openName} setOpenName={setOpenName} /> */}
      <PlayersLobby socket={socket} allPlayers={joinedPlayers} openLobby={openLobby} setOpenLobby={setOpenLobby} />
      <MessageBox socket={socket} allPlayers={joinedPlayers} />
      <FastestFingerFirst socket={socket} allPlayers={joinedPlayers} />
    </main>
  );
}