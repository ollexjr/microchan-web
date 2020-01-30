import React from "react"
import { useLocation, useHistory } from "react-router-dom"

export const Modal: React.FC = ({ children }) => {
    const history = useHistory();

    return (
        <div className="container dialog overlay d-flex flex-row justify-content-center _align-content-center"
            onClick={() => history.goBack()}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                cursor: 'pointer',
                pointerEvents: "initial",
                //boxShadow: 'rgb(117, 117, 117) 1px 1px 5px 0px',
                padding: '2em',
            }}>
            <div>
                <div className="box p-4" 
                    onClick={(e) => e.stopPropagation() }
                    style={{ 
                        //pointerEvents: "none",
                        backgroundColor: 'black',  
                        cursor: 'pointer' 
                    }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export const withModal = (View: (ob: any) => any) => {
    return (props: any) => {
        return (
            <Modal>
                {View(props)}
            </Modal>
        )
    }
}