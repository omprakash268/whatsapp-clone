import React from 'react'
import { useState } from 'react';
import { Button } from '@material-ui/core';
import "./alert.css";
import { Modal } from 'react-bootstrap';
export default function AlertDismissible({message,setfn,state}) {
    const [show, setShow] = useState(state);
    return (
        <>
        <Modal
        size="sm"
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Body>
         {message} 
         </Modal.Body>
         <Button className="btn btn-secondary close" variant="primary" onClick={setfn}>
            Close
            </Button>
      </Modal>
        </>
        
    );
  }
