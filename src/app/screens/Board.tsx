import React from "react"
import { Switch, Route, RouteComponentProps, RouteChildrenProps, match, Link, withRouter, useParams } from "react-router-dom"
import { request } from "../api"

import ThreadCreate from "./ThreadCreate"
import { withModal } from "../components/modal"
import ThreadView from "./Thread"

const ThreadLink: React.FC<{ url: string, threadID: string, title: string }> = (({ url, threadID, title }) => {
    return (
        <Link to={`${url}/t/${threadID}`}>
            <div className="p-2">
                <div className="px-4 py-2 box d-inline-block">
                    <p><strong>/t/{title}</strong></p>
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
            <div className="board box">
                <div>
                    {page.map((e) => <ThreadLink
                        url={match.url}
                        title={e.Title}
                        threadID={e.UUID} />)}
                </div>
            </div>
        )
    }
}

const BoardHeader: React.FC<{ boardID: string, url: string }> = ({ boardID, url }) => {
    return (
        <nav className="navbar box">
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
                        component={({ match }: RouteComponentProps<{ threadID: string }>) =>
                            <ThreadView threadID={match.params.threadID} />} />
                    <Route path={`${url}`}
                        component={(props: RouteComponentProps<any>) =>
                            <BoardView {...props} boardID={params.boardID} />} />
                </Switch>
                <Route path={`${url}/create`} component={withModal((props) => <ThreadCreate boardID={params.boardID} {...props} />)} />
            </div>
        )
    }
}