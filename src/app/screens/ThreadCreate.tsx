import React from "react"
import { request } from "../api";
import { withRouter, RouteComponentProps } from "react-router-dom";


class ThreadCreate extends React.Component<RouteComponentProps<{}> & { boardID: string }> {
    state = {
        title: "",
        status: 0
    }
    handleSubmit = (event: any) => {
        event.preventDefault();
        const { title } = this.state;
        const { boardID } = this.props;
        console.log("[threadcreate] submit ", title, boardID)
        if (title.length < 1) {
            return
        }
        request({
            method: 'POST', endpoint: '/boards/threads',
            expects: [200], format: 'object',
            args: { boardID: boardID }, json: { title }
        })
            .then(({ status, object }) => {
                this.setState({ status: status })
                this.props.history.replace(`t/${object.UUID}`)
            }, ({ status }) => {
                this.setState({ status })
            })
    }
    render() {
        const { title } = this.state;
        return (
            <div>
                <p>Create thread</p>
                <div className="input-group mb-3">
                    <form id="input" className="form-inline flex-grow-1" onSubmit={this.handleSubmit}>
                        <textarea className="form-control flex-grow-1 mr-sm-2"
                            value={title}
                            placeholder="Comment..." aria-label="Comment"
                            onChange={(event) => this.setState({ title: event.target.value })}/>
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Post</button>
                    </form>
                </div>
            </div>
        )
    }
}
export default withRouter(ThreadCreate)