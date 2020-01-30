import React from "react"
import { request } from "../api";

import moment from "moment"
import { RouteComponentProps } from "react-router-dom";

function displayName(name: string) {
    return name == "" ? "Anonymous" : name;
}

const User: React.FC<{
    dateCreated: number,
    username: string,
    userperms: number
}> = ({ dateCreated, username, userperms }) => {
    return (
        <div>
            <span style={{ marginRight: 10, color: 'green' }}>@{displayName(username)}</span>
            <small style={{ color: 'purple' }}>[{moment.unix(dateCreated).fromNow()}]</small>
        </div>
    )
}

export const ThreadPost: React.FC<{
    style?: object,
    content: string,
    dateCreated: number,
    username: string,
    userperms: number
}>
    = ({ style, content, dateCreated, username, userperms }) => {
        return (
            <div className="py-2">
                <div className="px-4 py-2 box d-inline-block"
                    style={style}>
                    <User dateCreated={dateCreated}
                        username={username}
                        userperms={userperms} />
                    <p>
                        {content}
                    </p>
                </div>
            </div>
        )
    }

class PostWriter extends React.Component<{ threadID: string, onSubmit: () => void }> {
    state = {
        text: ""
    }
    handleSubmit = (event: any) => {
        event.preventDefault();
        const { text } = this.state;
        const { threadID, onSubmit } = this.props;
        console.log("[threadcreate] submit ", text, threadID)
        if (text.length < 1) {
            return
        }
        request({
            method: 'POST', endpoint: '/boards/threads/posts',
            expects: [200],
            args: { threadID }, json: { content: text }
        })
            .then(
                ({ status }) => {
                    onSubmit()
                    this.setState({ status, text: "" })
                },
                () => {
                    onSubmit()
                    this.setState({ status: -1, text: "" })
                })
    }
    render() {
        const { text } = this.state;
        return (
            <nav className="container box navbar navbar-dark bg-dark _fixed-bottom">
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <textarea className="form-control mr-sm-2"
                        value={text}
                        placeholder="Search" aria-label="Search"
                        onChange={(event) => this.setState({ text: event.target.value })} />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
            </nav>
        )
    }
}

export default class ThreadView extends React.Component<RouteComponentProps<{}> & { threadID: string }> {
    state = {
        page: Array<any>(),
        status: 0
    }
    componentDidMount() {
        this.get()
    }
    get = () => {
        const { threadID } = this.props;
        request({
            method: 'GET', expects: [200], format: 'page',
            endpoint: "/boards/threads/posts", args: { threadID: threadID }
        }).then(({ status, page, next, prev }) => {
            this.setState({ page, status })
        })
    }
    render(): React.ReactNode {
        const { page } = this.state;

        // cast to {any} as I really can't be bothered 
        // to write the interface for this currently.
        const state: any = this.props.location.state;
        return (
            <>
                <div className="flex-grow-1 overflow-auto">
                    <ThreadPost
                        username={state.username}
                        content={state.content}
                        dateCreated={state.dateCreated}
                        userperms={state.userperms}
                    />
                    <div style={{ marginLeft: '1em', paddingLeft: "1em", borderLeft: "2px dashed red" }}>
                        {page.map((e) => <ThreadPost
                            userperms={0}
                            username={e.User.Name}
                            dateCreated={e.DateCreated}
                            content={e.Content} />)}
                    </div>
                </div>
                <PostWriter onSubmit={this.get} threadID={this.props.threadID} />
            </>

        )
    }
}