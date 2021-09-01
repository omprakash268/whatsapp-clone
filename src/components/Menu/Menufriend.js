import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Modal from 'react-bootstrap/Modal'
import { useState } from 'react';
import db from '../firebase/firebase';
import "./Menufriend.css"
import { storage } from '../firebase/firebase';
const ITEM_HEIGHT = 48;
function Example({photoURL,name,status}) {
    const [smShow, setSmShow] = useState(false);
    function close()
    {
      setSmShow(false) ;
    }
    return (
      <>
        <button onClick={() => setSmShow(true)}>Show Profile</button>
        <Modal
          size="lg"
          show={smShow}
          onHide={() => setSmShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Body className="flex-box">
           <img src={photoURL} alt="img" className="menufriend-img"></img>    
           <div className="div-rlative">
            <div className="status-center">{name}</div>
            <div className="status-heading">Status :</div>
            <div className="st-control">{status}</div>
           </div>
           </Modal.Body>
           <Button className="btn btn-secondary close" variant="primary" onClick={close}>
            Close
            </Button>
        </Modal>
      </>
    );
  }

export default function LongMenufriend({name,photoURL,status,roomId}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
 
  async function clearchat()
  {
    const ref= await db.collection('chats')
    .doc(roomId)
    .collection('messages');
       await ref.get()
        .then((snapshot)=>{
          snapshot.docs.forEach((doc)=>{
            ref.doc(doc.id)
            .delete()
            .then(()=>{
              console.log("successfully deleted");
            })
            .catch((err)=>{
              console.log(err);
            })
          })
        })
      setAnchorEl(null);
      return ;
  }



  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '15ch',
          },
        }}
      >
          <MenuItem  onClick={clearchat}>
            Clear Chat
          </MenuItem>
          <MenuItem onClick={handleClose} >
            <Example 
            name={name}
            photoURL={photoURL}
            status={status}
             />
          </MenuItem>
      </Menu>
    </div>
  );
}