import React, {useContext} from 'react';
import { StoreContext, } from '../context/store.context';
import { Switch,Route, Redirect, useLocation, useHistory } from 'react-router-dom';
import Paths from "../utils/path";

//Pages
import PortfolioPage from "../pages/PortfolioPage";
import EditPage from "../pages/EditPage";
import EditingPage from '../pages/editing/EditingPage.jsx';

import firebase from "../utils/firebase.js";


function AuthenticatedRoute() {
  const {state} = useContext(StoreContext);
  const username = state.user.username;
  const history = useHistory();
  const {pathname} = useLocation();

 

  React.useEffect(() => {
    if(state.user.isCompleted === false){
      history.push(Paths.SIGN_UP_2);
    }
  },[])
    
  return (
    <div>

      {
        state.user?.username ?
        <>
            {/* <Redirect from={"/home/edit"+state.user} to={"/home/edit/contact/"+state.user}  /> */}
            { (pathname === Paths.HOME) && <Redirect to={`${Paths.PORTFOLIO}/${state.user.username}`}/> }
            <Switch>
              <Route exact path={`${Paths.PORTFOLIO}/:username`} component={PortfolioPage} />
              <Route path={`${Paths.EDIT_PORTFOLIO}/:username`} component={EditPage} />

            {/* <Switch>
              <Route exact path="/home/portfolio" component={Portfolio} />
              <Route path={"/home/edit/"+username} component={EditingPage}  /> */}

            </Switch>
        </>
          : 
        <Redirect to={Paths.SIGN_IN}/>
      }


      {/* {((!state.token) || !(state.user)) && <Redirect to="/signin"/>} */}

      {/* <h1>User: {state.user}</h1> */}
     
    </div>
  )
}

export default AuthenticatedRoute
