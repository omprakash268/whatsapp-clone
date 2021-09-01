import React from 'react'
import { Button } from '@material-ui/core'
import "./login.css"
import { auth, provider } from '../firebase/firebase'
import { actionTypes } from 'E:/react js/Alok project/w3/whatsapp-clone-2app/src/reducer';
import {useStateValue} from "E:/react js/Alok project/w3/whatsapp-clone-2app/src/StateProvider";
import cookie from 'react-cookies'
import { Redirect } from "react-router-dom";
import db from '../firebase/firebase';
export default function Login() {
    // eslint-disable-next-line
    const [{user}, dispatch]=useStateValue();
    const userid=cookie.load("userid");
    const signin =()=>
    {
        auth
        .signInWithPopup(provider)
        .then((result)=>{
            const  user=result.user.uid;
            const name=result.user.displayName;
            const photoURL=result.user.photoURL;
            cookie.save("userid",user,{path:'/'});
            cookie.save('displayName',name,{path :'/'});
            db.collection('users')
            .where('userid','==',user)
            .onSnapshot((snapshot)=>{
                if(snapshot.empty)
                {
                    db.collection('users')
                    .add({
                      name:name,
                      userid:user,
                      photoURL:photoURL,
                      status:"Hey there I am using Whatsapp"
                    })
                    .then((ref)=>{
                    //   console.log(ref);
                      console.log("user is added");
                    })
                    .catch(error=>{
                      console.log(error);
                    })
                    cookie.save('photoURL',photoURL,{path:'/'});
                    cookie.save('status','Hey there I am using Whatsapp',{path:'/'});

                }
                else
                {
                    snapshot.docs.forEach((doc)=>{
                        cookie.save('photoURL',doc.data().photoURL,{path:'/'});
                        cookie.save('status',doc.data().status,{path:'/'});
                    });
                }
                dispatch({
                    type:actionTypes.SET_USER,
                    user:result.user,
                });
            })
        })
        .catch((error)=>console.log(error.message))

        
    };
    return userid?<Redirect to ="/whatsapp" />: 
       (<div className="login">
            <div className="login_container">
                <img 
                src="https://www.freeiconspng.com/thumbs/whatsapp-icon/whatsapp-logo-png-6.png" 
                alt="Whatsapp "/>
                <div className="login_text">
                    <h1>Sign in to Whatsapp </h1>
                </div>
                <Button  onClick={signin}>
                    Sign in with Google
                </Button>
            </div>
        </div>   )
}

