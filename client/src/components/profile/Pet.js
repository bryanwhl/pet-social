import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useLazyQuery } from '@apollo/client'
import { getPetByIdQuery } from '../../queries.js'

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      marginLeft: "20vw",
      marginRight: "20vw",
      marginTop: 20,
      height: "100vh",
      zIndex: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
    input: {
      display: "none"
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));

const Pet = ({ user, petId, isAddPet }) => {
  const classes=useStyles();

  const [pet, setPet] = useState(null)
  const [getPet, getPetResponse] = useLazyQuery(getPetByIdQuery, {
    fetchPolicy: "no-cache"
  })

  useEffect(() => {
    if (getPetResponse.data) {
      console.log("Pet, ", getPetResponse.data)
      setPet(getPetResponse.data.findPet)
    }
  }, [getPetResponse.data])

  useEffect(() => {
    if (petId) {
      console.log(petId)
      getPet({variables: {id: petId}})
    }
  }, [petId])

    return (
        <div>
            <CssBaseline>
                {isAddPet ? 
                "Add Pet Screen" :
                "Show Pet Screen"}
            </CssBaseline>
        </div>
    )
}

export default Pet
