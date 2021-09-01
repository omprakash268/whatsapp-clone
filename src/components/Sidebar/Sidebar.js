import React from 'react';
import "./Sidebar.css";
import db from '../firebase/firebase';
import { Avatar} from '@material-ui/core';
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from './SidebarChat';
import { useState ,useEffect } from 'react';
import cookie from "react-cookies";
import Loader from "../Loader/Loader";
import { Button } from '@material-ui/core';
import Modal from 'react-bootstrap/Modal'
import LongMenu from "../Menu/Menuuser";
import { storage } from '../firebase/firebase';
import AlertDismissible from '../Alerts/Alert';
import { PhotoCamera } from '@material-ui/icons';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';
export default function Sidebar() {
    const [loader,setLoader]=useState(false);
    const userid=cookie.load("userid");
  const [photoURL,setPhotoURL]=useState("");
  const displayName=cookie.load("displayName");
  const [searchName,setsearchName]=useState("");
  const [users,setUsers]=useState([]);
  const [smShow, setSmShow] = useState(false);
  const [image,setImage]=useState(null);
  const [state,setState]=useState(false);
  const [alertmessage,setAlertmessage]=useState("");
  const [show,setShow]=useState(false);
  var friendid;

  useEffect(() => {
    setLoader(true);
    db.collection('chats')
   .where('members','array-contains',userid)
   .onSnapshot((snapshot)=>{
     setUsers(snapshot.docs.map((doc)=>{
        return(doc)
       }))
       setLoader(false);
     })
    
   },[userid])
   useEffect(() => {
   db.collection('users')
   .where('userid','==',userid)
   .onSnapshot((snapshot)=>{
     setPhotoURL(snapshot.docs[0].data().photoURL);
   })
   }, [userid]);
  //  async function  searchfriend(id)
  //  {
  //    await db.collection('chats')
  //    .doc(id)
  //    .get()
  //    .then((snapshot)=>{
  //     const found=snapshot.data().members.find( id=> friendid===id);
  //      if(found!==undefined)
  //      {
  //        checkchat=true;
  //      }
  //    })
  //  }
    async function Search()
    {

      if(searchName===displayName)
      {
           setAlertmessage("You cannot chat withYourself");
           setState(true);
           return;
      }

       db.collection('users').where('name','==',searchName)
       .onSnapshot((snapshot)=>{
         if(snapshot.empty)
         {
           setAlertmessage("No user found");
           setState(true);
           return;
         }
         else
         {
           friendid=snapshot.docs[0].data().userid;
            db.collection('chats')
           .where("members",'==',[userid,friendid])
           .onSnapshot((snapshot)=>{
             console.log(snapshot);
             if(snapshot.empty)
             {
              db.collection('chats').add({
                members:[userid,friendid]
              })
              .then(()=>{
                console.log("successfully added");
              })
              .catch((e)=>{
                console.log(e);
              })
             }
             else
             {
                alert("Chat already exists");
             }
            
            })
          }})
       setsearchName("");
    }

    
    function setfn()
    {
      setState(false);
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
        const storageRef = storage.ref();
        //3.
        const imageRef = storageRef.child(image.name);
        //4.
        // console.log(imageRef);
        await imageRef.put(image)
        imageRef.getDownloadURL()
       //5.
       .then((e) => {
        //  setPhotoURL(e);
         db.collection('users')
         .where('userid','==',userid)
        .get()
         .then((snapshot)=>{
           console.log(snapshot.docs[0].id);
           db.collection('users').doc(snapshot.docs[0].id)
           .update({
             photoURL:e
           })
           .then(()=>{
           console.log("successfully updated");
           })
           .catch((e)=>{
             console.log(e);
           })
         })
         .catch((e)=>{
           console.log("error");
         })
          alert("Image uploaded successfully .");
      });
      } else {
        alert("Please upload an image first.");
      }
      setImage(null);
      setShow(false);
    };
    
    return ( 
         loader ? <Loader />  : <div className="sidebar">
            <div className="sidebar_header">
              <Avatar src={photoURL}  alt="no image"  onClick={()=>{setSmShow(true)}}/>
            <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Body> <img className="profile-size" height="200" width="200" src={photoURL} alt="no match" ></img>
        {  show ? <>
     <input type="file" accept="image/x-png,image/jpeg" onChange={(e) => {onImageChange(e); }} />
     <Button  ><CloudUploadIcon  onClick={uploadToFirebase}/> </Button>
     <Button onClick={()=>{setShow(false)}}><CloseIcon /> </Button>  
     </> 
     : <Button><PhotoCamera  onClick={()=>{setShow(true)}}/></Button> 
     }
        
        </Modal.Body>
      </Modal>
      {  state ?  <AlertDismissible 
                  message={alertmessage}
                  setfn={setfn}
                  state={true}
                />  :" "   }

        <div className="sidebar_headerRight">
            <h2>{displayName}</h2>
            <LongMenu />
            </div>
            </div>
            <div className="sidebar_search">
                <div className="sidebar_searchContainer">
                    <Button onClick={Search } className="search-button"><SearchOutlined /> </Button>
                    <input placeholder="Search for friends" 
                    type="text"  
                    className="search-input-field" 
                    value={searchName} 
                    onChange={(e)=>{setsearchName(e.target.value)}}
                    onKeyDown={(e)=>{if(e.key==='Enter'){ Search() }   }}
                    />
                </div>

               
            </div>
            <div className="sidebar_chats">
            {users.map(user =>
            <SidebarChat 
              id={user.id}
              key={user.id}
              user={user}
            />
            
            )}

            </div>
            
        </div>
        
        )
}
