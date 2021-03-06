import React, { useState, useContext ,useEffect} from 'react';
import { StoreContext } from '../../context/store.context';
import AxiosInstance  from "../../utils/axios";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import {educationFields} from './FieldNames';

import CardInfo from './CardInfo.jsx';
import PopUpInfo from './PopUpInfo';
import {useStyles} from './Styles.js';
import SuccessAlert from '../../components/EditDialog/index';

export default function Education() {
    const {state} = useContext(StoreContext);
    const classes = useStyles();
    const config = {
      headers: { Authorization: `Bearer ${state.user.token}` }
    };

    const initialState = {
      degree: "",
      institution: "",
      location:"",
      score:""
    }
    
    const [fields, setFields] = React.useState(initialState);
    const [existingData,setExistingData] = useState([]);
    const [editId, setEditId] = React.useState(null);
    const [onGoing, setOnGoing] = React.useState(false);
    const [formDisable,setFormDisable]= React.useState(false);
    const [warning,setWarning] = React.useState(false);

    //date changes
    const [startDate,setStartDate] =  React.useState(new Date());
    const [endDate,setEndDate] =  React.useState(new Date());

    //successful request
    const [alertSuccess, setAlertSuccess] = React.useState(false);

    //handle start date changes
    function handleStartDate(date){
      setStartDate(date);
    }

    //handle end date changes
    function handleEndDate(date){
      setEndDate(date);
    }

    //handle request alert 
    function closeAlert(){
      setAlertSuccess(false);
    }

    //handle field changes
    function onInputChange(e){
      setFields({
        ...fields,
        [e.target.name]: e.target.value
      })
    }

    //handle on going changes
    function handleOnGoing(event){
      setOnGoing(event.target.checked);
    };

    //check all inputs
    function validInputs(){
      return (fields.degree!=="" && fields.institution!=="" && startDate!==new Date(null))
    }
  
    //handle form submit
    function handleSubmit(e){
      e.preventDefault();
  
      const finalFields={ 
        username:state.user.username,
        ...fields,
        startDate:startDate, 
        endDate:endDate, 
        onGoing:onGoing}

      if(validInputs()===true){
        //disable form for request
        setFormDisable(true);
        //when user edits an existing entry
        if(editId!=null){
          AxiosInstance.put('/edit/education/'+editId,finalFields,config)
          .then((res)=> {
            if(res.status === 200 || res.status === 201){

              setAlertSuccess(true)
              resetForm()
            }
          })
          .catch(error=> console.log(error));
        }// when user submits a new entry
        else{
          AxiosInstance.post('/edit/education',finalFields,config)
          .then((res)=> {
            if(res.status === 200 || res.status === 201){
              setAlertSuccess(true)
              resetForm()
            }
          })
          .catch(error=> console.log(error));
        }
      }else{
        //alert here incomplete fields
        setWarning(true);
      }
    }

    //get user's education 
    function getExistingEducation(){
      //using username in backend 
      AxiosInstance.get("/edit/education",config)
      .then(res => res? setExistingData(res.data):null)
      .catch(error=>console.log(error))
    }

    //reset form fields
    function resetForm(){
      setFormDisable(false)
      setFields({ ...initialState });
      setEditId(null);
      setWarning(false);
    }

    //handle edit entry
    const myEditCallback = (idReceived) => {
      setFormDisable(false);
      AxiosInstance.get("/edit/education/"+idReceived,config)
      .then(res=> res? 
        setFields(res.data) && 
        setStartDate(new Date(res.data.startDate)) && 
        setOnGoing(res.data.onGoing) &&
        setEndDate(new Date(res.data.endDate)): null)
      .catch(error=>
        console.log(error));
      setEditId(idReceived);
    }

    //handle delete entry
    const myDeleteCallback = (idReceived) => {
      setFormDisable(false);
      console.log(idReceived);
      AxiosInstance.delete("/edit/education/"+idReceived,config)
      .then(res=> res? 
         getExistingEducation():null)
      .catch(error=>
        console.log(error));
    }

    useEffect(() => {
      getExistingEducation();
    },[formDisable,editId]);

    return (
      <div style={{padding:'0 5%'}}>
          <Container component="main" maxWidth="lg" >
            <SuccessAlert isOpen={alertSuccess} closeAlert={closeAlert}/>
            <Container component="main" maxWidth="lg" className={classes.listContainer}>
              <Hidden mdDown><CardInfo title={'Education'} datalist={existingData} fieldNames={educationFields} toEdit={myEditCallback} toDelete={myDeleteCallback}/> </Hidden>
              <Hidden lgUp><PopUpInfo  title={'Education'} datalist={existingData} fieldNames={educationFields} toEdit={myEditCallback} toDelete={myDeleteCallback}/></Hidden>
            </Container> 

            <Container component="main" maxWidth="lg" className={classes.formContainer}>
                <div className={classes.paper}>
                {warning?<Alert severity="error">Incomplete/Invalid fields input!</Alert>:null}
                  <form className={classes.form} disabled={formDisable} noValidate>
                    <Grid container spacing={3}> 
                        <Grid item xs={12} sm={12}>
                            <div className={classes.field}>Degree * </div>
                            <TextField
                            disabled={formDisable}
                            name="degree"
                            variant="outlined"
                            fullWidth
                            value={fields.degree}
                            placeholder="Bachelor of Science (Chemical Systems)"
                            onChange={onInputChange}   
                            error = {(fields.degree)===""}  
                            helperText={(fields.degree)!==""?null:"Incomplete entry"}                
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <div className={classes.field}> Institution Name *</div>
                            <TextField
                            disabled={formDisable}
                            name="institution"
                            variant="outlined"
                            fullWidth
                            value={fields.institution}
                            placeholder="University of Melbourne"
                            onChange={onInputChange}  
                            error = {(fields.institution)===""}  
                            helperText={(fields.institution)!==""?null:"Incomplete entry"}                 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div className={classes.field}> Location</div>
                            <TextField
                            disabled={formDisable}
                            variant="outlined"
                            required
                            fullWidth
                            id="location"
                            value={fields.location}
                            placeholder="Melbourne, Australia"
                            name="location"
                            onChange={onInputChange}                      
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div className={classes.field}> Score </div>
                            <TextField
                            disabled={formDisable}
                            variant="outlined"
                            required
                            fullWidth
                            id="score"
                            placeholder="80%"
                            name="score"
                            value={fields.score}
                            onChange={onInputChange}                   
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div className={classes.field}> Start Date *</div>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              autoOk
                              id="startDate"
                              variant="inline"
                              inputVariant="outlined"
                              format="dd/MM/yyyy"
                              value={startDate}
                              onChange={date=>handleStartDate(date)}
                              error = {(startDate)===null}  
                              helperText={startDate!==null?null:"Incomplete entry"}
                            />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div className={classes.field}> End Date </div>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              disabled={onGoing||formDisable}
                              autoOk
                              variant="inline"
                              inputVariant="outlined"
                              format="dd/MM/yyyy"
                              id="endDate"
                              value={endDate}
                              onChange={date=>handleEndDate(date)}
                            />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={onGoing}
                                onChange={handleOnGoing}
                                color="primary"
                              />
                            }
                            label="On Going"
                          />
                        </Grid>
                      <Grid item xs={12} sm={12} style={{marginTop:'1%'}}>
                        <Button
                          disabled={formDisable}
                          type="submit"
                          variant="contained" 
                          color="secondary" 
                          onClick={event=>handleSubmit(event)}>
                          Save to my Education  
                          {formDisable?<CircularProgress color="secondary" size={20}/>:null}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                  </div>      
              </Container>
            </Container>
          </div>
    );
  }