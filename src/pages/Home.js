import React, { useEffect } from 'react'
import { userQuery, gql, useQuery } from '@apollo/client'
import ReactMarkdown from 'react-markdown'

import Header from '../components/Headers'
import Navigation from '../components/Navigation'
import Button from '../components/Button'
import NoteFeed from '../components/NoteFeed'

import { GET_NOTES } from '../gql/query'

const Home = () => {
    useEffect(() => {
        // update the document title
        document.title = 'Home - Notedly'
    })

    // query hook
    const { data, loading, error, fetchMore } = useQuery(GET_NOTES)

    // if the data is loading, display a loading message
    if (loading) {
        return (
            <p>Loading...</p>
        )
    }

    // if there is an error fetching the data, display an error message
    if (error) {
        return (
            <p>Error!</p>
        )
    }

    // if the data is successful, display the data in our UI
    return (
        // <div>
        //     {console.log(data)}
        //     {data.noteFeed.notes.map(note => (
        //         <article key={note.id}>
        //             <img
        //                 src={note.author.avatar}
        //                 alt={`${note.author.username} avatar`}
        //                 height="50px"
        //             />{' '}
        //             {note.author.username} {note.createdAt} {note.favoriateCount}{' '}
        //             <ReactMarkdown source={note.content} />
        //         </article>
        //     ))}
        // </div>
        
        // add a <React.Fragment> element to provide a parent element
        <React.Fragment>
            <NoteFeed notes={data.noteFeed.notes} />
            {/* Only display the Load More button if hasNextPage is true */}
            {data.noteFeed.hasNextPage && (
                // onClick perform a query, passing the current cursor as a variable
                <Button
                    onClick={() => 
                        fetchMore({
                            variables: {
                                cursor: data.noteFeed.cursor
                            },
                            updateQuery: (previousResult, { fetchMoreResult }) => {
                                return {
                                    noteFeed: {
                                        cursor: fetchMoreResult.noteFeed.cursor,
                                        hasNextPage: fetchMoreResult.noteFeed.hasNextPage,
                                        // combine the new results and the old
                                        notes: [
                                            ...previousResult.noteFeed.notes,
                                            ...fetchMoreResult.noteFeed.notes
                                        ],
                                        __typename: 'noteFeed'
                                    }
                                }
                            }
                        })
                    }
                >
                    Load more
                </Button>
            )}
        </React.Fragment>
    )
}

export default Home