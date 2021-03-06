import React, {useState, useContext} from 'react'
import { StoreContext } from '../../context/store.context';
import { makeStyles } from '@material-ui/core/styles';
import CardAccent from "../../common/CardAccent";
import Typography from '@material-ui/core/Typography';
import Custom1ListItem from "../../components/Portfolio/Custom1ListItem"
import Divider from '@material-ui/core/Divider';

import AxiosInstance from "../../utils/axios";
import axios from 'axios'
import SkeletonCard from "../../common/SkeletonCard";

const useStyles = makeStyles( theme => ({
  root: {
    padding: theme.spacing(2),
    borderBottom: `5px solid ${theme.palette.primary.main}`
  },
  label:{
    fontWeight: 700
  },
  title:{
    paddingTop: theme.spacing(2),
    fontWeight: 700,
    fontSize: "1.333rem"
  },
  subTitle:{
    fontWeight: 700,
    fontSize: "1.2rem"
  },
  desc:{
    fontSize: "1rem",
    paddingTop: theme.spacing(1)
  },

}));

const accentColor ="#1E88E5";

function Custom1Controller(props) {
  const classes = useStyles();
  const {state} = useContext(StoreContext);
  const config = {
    headers: { Authorization: `Bearer ${state.user.token}` }
  };

  const { user } = props;


  const [loading, setLoading] = useState(true);
  const [custom, setCustom] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("");
  React.useEffect(() => {
    setLoading(true);
    const source = axios.CancelToken.source();
   

    AxiosInstance
      .get(`/public/custom/${user}`, config)
      .then(response => {
        // const { data } = response;
        // setProjects(data);
        const data = response?.data;

        if(data) {
          setCustom(data.custom1.data);
          setSectionTitle(data.custom1.sectionTitle);
        }
        
      })
    
    setLoading(false);
    return () => {
      source.cancel(
        "Canceled because of component unmounted"
      );
    };
    },[user])

    if ((custom.length==undefined) || (custom.length) < 1) {
      return (
        <>
        </>
      )
    }

  return (
    <CardAccent className={classes.root} color={accentColor}>
      <Typography className={classes.label} variant="h4" gutterBottom>
        {sectionTitle}
      </Typography>
      {
        loading? <SkeletonCard/>:
        custom.map((value,key) => {
          return(
            <>
            {
              (key === custom.length - 1) ?
              <Custom1ListItem key={key} data={value}/>:
              <>
                <Custom1ListItem key={key} data={value}/>
                <Divider />
              </>
                
            }
            </>

            // <Custom1ListItem key={key} data={value}/>
          )
        })
      }
    </CardAccent>
  )
}
export default Custom1Controller
