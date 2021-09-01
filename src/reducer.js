
export const initialState ={
    user:null
}
export const actionTypes ={
    SET_USER :"SET_USER"
}

//call from useReducer(reducer,initialstate) 
const reducer=(state,action)=>{
    // console.log(action);
    switch(action.type){
        case actionTypes.SET_USER:
            return {
                ...state,
                user:action.user
            };
            default : return state;
    }
}
export default reducer;