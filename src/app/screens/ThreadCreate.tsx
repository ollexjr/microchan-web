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
            args: { boardID: boardID }, json: { title } })
            .then(({ status, object }) => {
                this.setState({ status: status })
                this.props.history.replace(`t/${object.UUID}`)
            }, ({ status }) => {
                this.setState({ status })
            })
    }
    render() {
        return (
            <div>
                <p>Create thread</p>
                <div className="input-group mb-3">
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text" className="form-control"
                            placeholder="Title" aria-label="Title"
                            aria-describedby="basic-addon1"
                            onChange={(event) => this.setState({ title: event.target.value })}
                        />
                        <input type="submit" className="btn btn-primary" value="Create" />
                    </form>
                </div>
            </div>
        )
    }
}
export default withRouter(ThreadCreate)