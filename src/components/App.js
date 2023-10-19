import Header from "./Header";
import Main from "./Main";
import {useEffect, useReducer} from "react";
import Loader from "./Loader";
import Error from "./Error";
import {StartScreen} from "./StartScreen";
import {Question} from "./Question";

/*
* @initialState.status = 'loading','error,',ready','active' or 'finished'
* */
const initialState = {
    questions: [],
    status: 'loading',
    index: 0
}

function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived':
            return {
                ...state, questions: action.payload, status: 'ready'
            }
        case 'dataFailed':
            return {
                ...state, status: 'error'
            }
        case 'start':
            return {
                ...state, status: 'active'
            }
        default:
            throw new Error('Action unknown')
    }
}

export default function App() {

    const [{questions, status, index}, dispatch] = useReducer(reducer, initialState)

    const numQuestions = questions.length

    useEffect(() => {
        fetch('http://localhost:3000/questions')
            .then((data) => data.json())
            .then((data) => dispatch({type: 'dataReceived', payload: data}))
            .catch((error) => dispatch({type: 'dataFailed'}))
    }, []);

    return (
        <div className="app">
            <Header/>
            <Main>
                {status === 'loading' && <Loader/>}
                {status === 'error' && <Error/>}
                {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
                {status === 'active' && <Question question={questions[index]} />}
            </Main>
        </div>
    )
}