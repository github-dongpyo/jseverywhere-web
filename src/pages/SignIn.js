import React, { useEffect } from 'react'
import { useMutation, useApolloClient, gql } from '@apollo/client'

import UserForm from '../components/UserForm'

const SIGNIN_USER = gql`
    mutation signIn($email: String!, $password: String!) {
        signIn(email: $email, password: $password)
  }
`

// include the props passed to the component for later use
const SignIn = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Sign In - Notedly'
    })

    // Apollo Client
    const client = useApolloClient()

    // add the mutation hook
    const [signIn, { loading, error }] = useMutation(SIGNIN_USER, {
        onCompleted: data => {
            // console.log the JSON Web Token when the mutation is complete
            // console.log(data.signIn)
            // store the token
            localStorage.setItem('token', data.signIn)
            // update the local cache
            client.writeData({ data: { isLoggedIn: true }})
            // redirect the user to the homepage
            props.history.push('/')
        }
    })

    return (
        <React.Fragment>
            <UserForm action={signIn} formType="signin" />
            {loading && <p>Loading...</p>}
            {error && <p>Error signing in!</p>}
        </React.Fragment>
    )
}

export default SignIn