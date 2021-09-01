import React ,{createContext,useContext ,useReducer } from "react";
export const StateContext=createContext();

export const StateProvider =({reducer,initialState,children }) =>(
    <StateContext.Provider value={useReducer(reducer,initialState)} >
        {children}
    </StateContext.Provider>
);
export const useStateValue=()=>useContext(StateContext);

//StateProvider is used in index.js where we pass reducer ,initialstate and children


//when useStateValue is called from any component then
//first statecontext call createcontext and then useStateValue is called 
// UseContext() is called passing StateContext.
//it returns the value from  StateContext.provider 
//useReducer is called passing reducer function and initialState
// it returns the current state and dispatch function
//use  Context --When the nearest <MyContext.Provider> above the component updates, this Hook will trigger a rerender with the latest context value passed to that MyContext provider. 





//useContext

// Accepts a context object (the value returned from React.createContext) and returns the current context value for that context. The current context value is determined by the value prop of the nearest <MyContext.Provider> above the calling component in the tree.

// When the nearest <MyContext.Provider> above the component updates, this Hook will trigger a rerender with the latest context value passed to that MyContext provider.


// useReducer
// An alternative to useState. Accepts a reducer of type (state, action) => newState, and returns the current state paired with a dispatch method. (If you’re familiar with Redux, you already know how this works.)