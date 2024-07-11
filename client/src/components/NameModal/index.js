import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

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

export default function NameModal({socket, openName, setOpenName}) {
	const [name, setName] = React.useState("")
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleSubmit = () => {
		if(name === ""){
			return;
		}
		socket.emit("player-joined", name)
		handleClose()
		setOpenName(true)
	}

	return (
		<div>
			<Modal
				open={openName}
				// onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography className='pb-5' id="modal-modal-title" variant="h6" component="h2">
						Welcome! Enter your Name
					</Typography>
					<Box
						sx={{
							width: 500,
							maxWidth: '100%',
						}}
					>
						<TextField onChange={(e) => setName(e.target.value)} fullWidth id="fullWidth" />
					</Box>
					<div className='mt-2'>
						<Button onClick={() => handleSubmit()}>Submit</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
}