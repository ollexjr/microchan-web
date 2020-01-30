import React from "react"
import { Switch, Route, RouteComponentProps, RouteChildrenProps, match, Link, withRouter, useParams } from "react-router-dom"
import { request } from "../api"

import ThreadCreate from "./ThreadCreate"
import { ThreadPost } from "./Thread"
import { withModal } from "../components/modal"
import ThreadView from "./Thread"
import moment from "moment"


const ThreadLink: React.FC<{
    url: string,
    threadID: string,

    username: string,
    userperms: number,
    dateCreated: number,
    content: string,
    count: number,
    posts: Array<any>
}>
    = (({ url, threadID,
        posts, dateCreated, userperms, username, content, count }) => {
        const viewMore = (posts && posts.length) > 0 ? count -  posts.length : 0  
        return (
            <Link to={{ 
                    pathname: `${url}/t/${threadID}`, 
                    state: {
                        posts, 
                        dateCreated, 
                        userperms, 
                        username, 
                        content, 
                        count
                    }
                }}>
                <div className="pb-1">
                    <div className="px-2 py-0">
                        <ThreadPost
                            style={{ borderLeftColor: 'red' }}
                            content={content}
                            username={username}
                            userperms={userperms}
                            dateCreated={dateCreated}
                        />
                        <div style={{ marginLeft: '1em', paddingLeft: "1em", borderLeft: "2px dashed red" }}>
                            {posts.map((e: any) =>
                                <ThreadPost
                                    userperms={0}
                                    username={e.User.Name}
                                    dateCreated={e.DateCreated}
                                    content={e.Content} />)}
                        </div>
                        <div className="px-4">
                            <p>View {viewMore} more replies</p>
                        </div>
                    </div>
                </div>
            </Link>
        )
    })

class BoardView extends React.Component<RouteComponentProps<{}> & { boardID: string }> {
    componentDidMount() {
        const { boardID } = this.props;
        request({
            method: 'GET', endpoint: "/boards/threads",
            expects: [200], format: 'page', args: { boardID }
        }).then(({ status, page }) => {
            this.setState({ page, status })
        }, () => {

        })
    }
    state = {
        page: Array<any>()
    }
    render(): React.ReactNode {
        const { page } = this.state;
        const { match } = this.props;
        return (
            <div className="board _box">
                <div>
                    {page.map((e) => <ThreadLink
                        url={match.url}
                        threadID={e.UUID}
                        dateCreated={e.DateCreated}
                        userperms={0}
                        username={e.User.Name}
                        content={e.Content}
                        count={e.Count}
                        posts={e.Posts || []} />)}
                </div>
            </div>
        )
    }
}

const BoardHeader: React.FC<{ boardID: string, url: string }> = ({ boardID, url }) => {
    return (
        <nav className="navbar" style={{ borderBottom: "2px solid white"}}>
            <a className="" href="#">/b/{boardID}</a>
            <Link to={`${url}/create`}>
                <button className="btn btn-dark">Create thread</button>
            </Link>
        </nav>
    )
}

export class BoardRouter extends React.Component<RouteComponentProps<{ boardID: string }>> {
    render() {
        const { url, params } = this.props.match;
        console.log("[board] ", `${url}/create`, params)
        return (
            <div className="d-flex flex-column h-100">
                <BoardHeader boardID={params.boardID} url={url} />
                <Switch>
                    <Route path={`${url}/t/:threadID`}
                        component={({ location, match, history }: RouteComponentProps<{ threadID: string }>) =>
                            <ThreadView location={location} history={history} match={match} threadID={match.params.threadID} />} />
                    <Route path={`${url}`}
                        component={(props: RouteComponentProps<any>) =>
                            <BoardView {...props} boardID={params.boardID} />} />
                </Switch>
                <Route path={`${url}/create`} component={withModal((props) => <ThreadCreate boardID={params.boardID} {...props} />)} />
            </div>
        )
    }
}