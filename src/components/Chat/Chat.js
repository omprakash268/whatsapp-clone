import { Avatar } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import React, { useState ,useEffect } from 'react'
import { IconButton } from '@material-ui/core';
import "./Chat.css";
import Chatmessage from './Chatmessage';
import Chatmessagerecieve from './Chatmessagerecieve';
import firebase from "firebase";
import SendIcon from '@material-ui/icons/Send';
import { useParams } from 'react-router';
import db from '../firebase/firebase';
import cookie from 'react-cookies';
import { useRef } from 'react';
import LongMenufriend from '../Menu/Menufriend';
import Emoji from "../Emoji/Emoji";
import CloseIcon from '@material-ui/icons/Close';
import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import { storage } from '../firebase/firebase';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Button } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import AlertDismissible from '../Alerts/Alert';
import Loader from "react-js-loader";

export default function Chat() {
    const [input,setInput]=useState("");
    const userid=cookie.load("userid");
    const [photoURL,setPhotoURL]=useState(cookie.load("photoURL"));
    const {roomId}=useParams();
    const [name,setName]=useState("");
    const [messages,setMessages]=useState([]);
    const [status,setStatus]=useState(cookie.load("status"));
    const [emojiTemplate,setEmojiTemplate]=useState(false);
    const [show,setShow]=useState(false);
    const [showfile,setShowfile]=useState(false);
    const [file,setFile]=useState(null);
    const m="last message ";
  const [image,setImage]=useState(null);
  const [loader,setLoader]=useState(false);
    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior:"smooth"});
    }, [messages])
    useEffect(  ()=>
    {
         db.collection("chats").doc(roomId).collection("messages").orderBy
        ("timestamp","asc").onSnapshot(snapshot=>
            (
              setMessages(snapshot.docs.map(doc=> doc.data()))
            ) 
            )
    },[roomId]);
    useEffect( () => {
         db.collection("chats").doc(roomId)
        .onSnapshot((snapshot)=>{
            if(snapshot.data())
            {
                const  temp=(snapshot.data().members.filter((u)=>{return u!==userid}));
                db.collection('users')
                .where('userid','==',temp[0])
                .onSnapshot((snapshot)=>{
                    if(snapshot)
                    {
                        snapshot.docs.forEach((doc)=>{
                            setPhotoURL(doc.data().photoURL);
                            setName(doc.data().name);
                            setStatus(doc.data().status);
                        })
                    }
                })
            }
        })

    }, [roomId])
    const  sendmessage =async(e)=>
    {
        e.preventDefault();
        if(input==="")
        {
            return;
        }
        
        await db.collection("chats").doc(roomId).collection("messages").add({
            message:input,
            senderid:userid,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            type:"text"
        })
        setInput("");
        setEmojiTemplate(false);
    }
    function setEmoji(Emoji)
    {
        setInput(input+ Emoji);
    }
const onImageChange = (e) => {
    const reader = new FileReader();
    let file = e.target.files[0]; // get the supplied file
    // if there is a file, set image to that file
    if (file) {
      reader.onload = () => {
        if (reader.readyState === 2) {
        //   console.log(file);
          setImage(file);
        //   setShowimage(true);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
     
    // if there is no file, set image back to null
    } else {
      setImage(null);
    }
  };
  const uploadToFirebase = async () => {
    //1.
    if (image) {
      //2.
      setLoader(true);
      const storageRef = storage.ref();
      //3.
      const imageRef = storageRef.child(image.name);
      //4.
      // console.log(imageRef);
      await imageRef.put(image)
      setLoader(false);
      imageRef.getDownloadURL()

     //5.
     .then((e) => {
       db.collection("chats").doc(roomId).collection("messages").add({
        message:e,
        senderid:userid,
        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        type:"image",
        name:image.name
    })
        // alert("Image uploaded successfully .");
    });
    } else {
      alert("Please upload an image first.");
    }
    setImage(null);
    setShow(false);
  };
  const onFileChange = (e) => {
    const reader = new FileReader();
    let file = e.target.files[0]; // get the supplied file
    // if there is a file, set image to that file
    if (file) {
      reader.onload = () => {
        if (reader.readyState === 2) {
          setFile(file);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setFile(null);
    }
  };
  const uploadFileToFirebase = async () => {
    //1.
    if (file) {
      console.log(file.name);
      //2.
      setLoader(true);
      const storageRef = storage.ref();
      //3.
      const FileRef = storageRef.child(file.name);
      //4.
      await FileRef.put(file)
      setLoader(false);
      FileRef.getDownloadURL()
     //5.
     .then((e) => {
        // alert("doc uploaded successfully .");
        db.collection("chats").doc(roomId).collection("messages").add({
          message:e,
          senderid:userid,
          timestamp:firebase.firestore.FieldValue.serverTimestamp(),
          type:"doc",
          name:file.name
      })
    });
  setFile(null);
    } else {
      alert("Please upload a document first.");
    }
    setShowfile(false);
  };

    
    return (
        <div className="chat">
       <div className="chat_header"  >
            <Avatar src={photoURL } alt="" />
        <div className="chat_headerInfo">
        <h3>{name}</h3>
        <p> 
        {
            messages.length>=1? m+ new Date(messages[messages.length - 1]?.timestamp?.toDate()).toLocaleString() 
                : "No message yet"
        }
        </p>
        {
           loader ? <Loader className="file-loader" type="bubble-ping" bgColor={"cyan"} />: " "
        }
        </div>
<div className="chat_headerRight">

     
        {
          showfile?<> 
          <input type="file" className="file-upload" onChange={(e) => {onFileChange(e); }} />
     <Button > <CloudUploadIcon  onClick={uploadFileToFirebase}/> </Button>
     <Button onClick={()=>{setShowfile(false)}}><CloseIcon /> </Button>  
     </> :
         <Button> <AttachFileIcon className="attach-file" onClick={()=>{setShowfile(true)}}/> </Button>
        }



     {  show ? <>
     <input type="file"  accept="image/x-png,image/jpeg" className="file-upload"  onChange={(e) => {onImageChange(e); }} />
     <Button onClick={uploadToFirebase} > <CloudUploadIcon  /> </Button>
     <Button onClick={()=>{setShow(false)}}><CloseIcon /> </Button>  
     </> 
     : <Button onClick={()=>{setShow(true)}}><PhotoCamera className="attach-file" /></Button> 
     }
    <IconButton>
    <LongMenufriend
    photoURL={photoURL}
    name={name}
    status={status}
    roomId={roomId}
    />
    </IconButton>
</div>
</div>
<div className="chat_body"  >
    {messages.map(message=>{    
    return message.senderid!==userid? 
     <div ref={scrollRef}>
        <Chatmessage
    timestamp={new Date(message.timestamp?.toDate()).toLocaleString()}
    message={message.message}
    key={message.id}
    type={message.type}
    name={message.name}
    />
    </div> : <div ref={scrollRef}> 
    <Chatmessagerecieve
    timestamp={new Date(message.timestamp?.toDate()).toLocaleString()}
    message={message.message}
    key={message.id}
    type={message.type}
    name={message.name}
    /></div>
})
}    
</div>

<div className="chat_footer">
    {
      emojiTemplate ? <>
      <Emoji 
     setEmoji={setEmoji}   
    />
    <Button onClick={()=>{setEmojiTemplate(false)}}><CloseIcon /></Button>
    </>
    : <Button onClick={()=>{setEmojiTemplate(true)}} ><EmojiEmotionsOutlinedIcon /></Button>
    }
    <form className="last"> 
         <input 
        value={input}
        className="type-msg"
        onChange={(e)=>setInput(e.target.value)}
         placeholder="Type a message"
          type="text" />
      <button onClick={sendmessage}type="submit"><SendIcon /></button>
    </form>
    {/* <MicIcon /> */}
</div>
        </div>
    )
}
