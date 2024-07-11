import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

export default function PlayersLobby({ socket, allPlayers, openLobby, setOpenLobby }) {
	const [name, setName] = React.useState("")
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleReadyClick = (player) => {
		player.ready = !player.ready
		socket.emit("update-player", player)
	}

	const handleGameStartClick = () => {
		socket.emit("start-game", allPlayers.find(player => player.socketId === socket.id));
	}

	socket.on("game-started", () => {
		setOpenLobby(false)
	})
	console.log(allPlayers)
	return (
		<div>
			<Modal
				open={openLobby}
				// onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography className='pb-5'>
						Room ID: {allPlayers[0]?.roomID || ""}
					</Typography>
					<Typography className='pb-5' id="modal-modal-title" variant="h6" component="h2">
						Waiting for players to join....
					</Typography>
					{allPlayers.length > 0 && allPlayers.map((player, index) => (
						<Box
							key={index}
							sx={{
								width: 500,
								maxWidth: '100%',
								display: 'flex',
								justifyContent: 'start',
								alignItems: "center",
								marginBottom: "10px"
							}}
						>
							<div className='w-2 h-2 rounded-full bg-green-500 mr-2'></div>
							<div>{player.name}</div>
							<Button disabled={true} variant="outlined" style={{marginLeft: "auto"}} onClick={() => handleReadyClick(player)}>{player.ready ? "Ready" : "Not Ready"}</Button>
						</Box>
					))}
					<div className='mt-5'>
						<Button style={{width: "100%"}} variant="contained" color="success" onClick={() => handleGameStartClick()}>
							Start the game
						</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
}