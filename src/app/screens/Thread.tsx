import React from "react"
import { request } from "../api";

import moment from "moment"

const ThreadPost: React.FC<{ content: string, user: any, dateCreated: number }> 
    = ({ content, dateCreated }) => {
    return (
        <div className="py-2">
            <div className="px-4 py-2 box d-inline-block" style={{ borderLeft: '0px' }}>
                <div className="">
                    <span>{moment.unix(dateCreated).fromNow()}</span>
                </div>
                <div>
                    {content}
                </div>
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

export default class ThreadView extends React.Component<{ threadID: string }> {
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
        return (
            <>
                <div className="box flex-grow-1 overflow-auto">
                    {page.map((e) => <ThreadPost 
                        user={e.User}
                        dateCreated={e.DateCreated} 
                        content={e.Content} />)}
                </div>
                <PostWriter onSubmit={this.get} threadID={this.props.threadID} />
            </>

        )
    }
}