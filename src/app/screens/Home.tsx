import React from "react"
import { request } from "../api";
import { Link } from "react-router-dom";

const Item: React.FC<{ name: string }> = ({ name }) => {
    return (
        <Link to={`/b/${name}`}>
            <div>
                <p>{name}</p>
            </div>
        </Link>
    )
}

export default class HomeView extends React.Component<{ boardID: string }> {
    componentDidMount() {
        request({
            method: 'GET', endpoint: "/boards",
            expects: [200], format: 'page'
        }).then(({ status, page }) => {
            this.setState({ page, status })
        })
    }
    state = {
        page: Array<any>()
    }
    render(): React.ReactNode {
        const { page } = this.state;
        return (
            <div className="h-100 p-2">
                <p style={{ borderBottom: "2px solid white" }}>
                    Boards
                </p>
                <div>
                    {page.map((e) => <Item name={e.Name} />)}
                </div>
            </div>
        )
    }
}