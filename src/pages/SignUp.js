import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useMutation, useApolloClient, gql } from '@apollo/client'

import Button from '../components/Button'
import UserForm from '../components/UserForm'

const Wrapper = styled.div`
    border: 1px solid #f5f4f0; 
    max-width: 500px; 
    padding: 1em;
    margin: 0 auto;
`

const Form = styled.form` 
    label,
    input {
        display: block;
        line-height: 2em;
    }

    input {
        width: 100%;
        margin-bottom: 1em;
    }
`

const SIGNUP_USER = gql`
    mutation signUp($email: String!, $username: String!, $password: String!) {
        signUp(email: $email, username: $username, password: $password)
  }
`

// include the props passed to the component for later use
const SignUp = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Sign Up - Notedly'
    })

    // set the default state of the form
    const [values, setValues] = useState()

    // update the state when a user types in the form
    const onChange = event => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }

    // Apollo Client
    const client = useApolloClient()

    // add the mutation hook
    const [signUp, { loading, error }] = useMutation(SIGNUP_USER, {
        onCompleted: data => {
            // console.log the JSON Web Token when the mutation is complete
            console.log(data.signUp)
            // store the token
            localStorage.setItem('token', data.signUp)
            // update the local cache
            client.writeData({ data: { isLoggedIn: true }})
            // redirect the user to the homepage
            props.history.push('/')
        }
    })

    return (
        <React.Fragment>
            <UserForm action={signUp} formType="signup" />
            {loading && <p>Loading...</p>}
            {error && <p>Error creating an account!</p>}
        </React.Fragment>
    )
}

export default SignUp