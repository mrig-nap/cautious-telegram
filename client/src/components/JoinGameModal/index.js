import {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Divider } from '@mui/material';
import { generateRandomID } from '@/utils/globalFunctions';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export default function JoinGameModal({socket, setOpenLobby}) {
	const [roomId, setRoomId] = useState("")
  const [name, setName] = useState("")
	const [open, setOpen] = useState(true);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleCreateGame = () => {
		const roomID = generateRandomID(6);
    if(name === ""){
			return;
		}
		socket.emit("join-room", name, socket.id, roomID)
		handleClose()
		setOpenLobby(true)
	}

  const handleJoinGame = () => {
    if(roomId === "" || name === ""){
			return;
		}
    socket.emit("join-room", name, socket.id, roomId)
    handleClose()
    setOpenLobby(true)
  }

	return (
		<div>
			<Modal
				open={open}
				// onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography className='pb-5' id="modal-modal-title" variant="h6" component="h2">
						Welcome to Kaun Banega Crorepati!
					</Typography>
          <Box
						sx={{
							width: 500,
							maxWidth: '100%',
						}}
					>
						<TextField placeholder='Enter your name' onChange={(e) => setName(e.target.value)} fullWidth id="fullWidth" />
					</Box>
          <div className='mt-2 text-center mb-4'>
						<Button variant="contained" onClick={() => handleCreateGame()}>Create Game</Button>
					</div>
          <Divider>OR</Divider>
					<Box
						sx={{
							width: 500,
							maxWidth: '100%',
              marginTop: '20px'
						}}
					>
						<TextField placeholder='Enter Room ID' onChange={(e) => setRoomId(e.target.value)} fullWidth id="fullWidth" />
					</Box>
					<div className='mt-2 text-center'>
						<Button variant="contained" onClick={() => handleJoinGame()}>Join Game</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
}