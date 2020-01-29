import React from "react"
import { request } from "../api";
import { withRouter, RouteComponentProps } from "react-router-dom";


class BoardCreate extends React.Component<RouteComponentProps<{}> & {}> {
    state = {
        name: ""
    }
    handleSubmit = (event: any) => {
        event.preventDefault();
        const { name } = this.state;

        console.log("[BoardCreate] submit ", name)
        if (name.length < 1) {
            return
        }
        request({
            method: 'POST', endpoint: '/boards', 
            expects: [200], format: 'object', 
            json: { name }
        }).then(({ status, object }) => {
            this.props.history.replace(`/b/${object.UUID}`)
        })
    }
    render() {
        return (
            <div>
                <p>Create a board</p>
                <div className="input-group mb-3">
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text" className="form-control"
                            placeholder="Board" aria-label="Board"
                            aria-describedby="basic-addon1"
                            onChange={(event) => 
                                this.setState({ name: event.target.value })}
                        />
                        <input type="submit" className="btn btn-primary" value="Submit"/>
                    </form>
                </div>
            </div>
        )
    }
}
export default withRouter(BoardCreate)