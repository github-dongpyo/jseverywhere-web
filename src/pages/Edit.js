import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'

import NoteForm from '../components/NoteForm'
import { GET_NOTE, GET_ME } from '../gql/query'
import { EDIT_NOTE } from '../gql/mutation'

const EditNote = props => {
    // store the id found in the url as a variable
    const id = props.match.params.id
    // define our note query
    const { loading, error, data } = useQuery(GET_NOTE, { variables: { id } })
    // fetch the current user's data
    const { data: userdata } = useQuery(GET_ME)
    // define our mutation
    const [editNote] = useMutation(EDIT_NOTE, {
        variables: {
            id
        },
        onCompleted: () => {
            props.history.push(`/note/${id}`)
        }
    })

    if (loading) return 'Loading...'
    if (error) return <p>Error! Note not found</p>

    if (userdata.me.id !== data.note.author.id) {
        return <p>You do not have access to edit this note</p>
    }
    
    return <NoteForm content={data.note.content} action={editNote} />
}

export default EditNote