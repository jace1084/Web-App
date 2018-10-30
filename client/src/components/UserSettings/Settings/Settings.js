import React, { Component } from "react";
import "./Settings.css";
import { Link } from "react-router-dom";



class Settings extends Component {

    componentDidMount() {



    }


    render() {
        console.log(this.state);
        // console.log(this.props.location.pathname);
        console.log(this.props.match.params.id);

        return (
            // <div className="d-flex flex-row text-center justify-content-center">
            //     <label className="radio-label d-flex flex-column px-4"><br /><div className="radio-div"><input className="radio" type="radio" name="selection" value="settings" /></div> Settings</label>
            //     <label className="radio-label d-flex flex-column px-4"><br /><div className="radio-div"><input className="radio" type="radio" name="selection" value="privacy" /></div> Privacy</label>
            //     <label className="radio-label d-flex flex-column px-4"><br /><div className="radio-div"><input className="radio" type="radio" name="selection" value="cryptocurrency" /></div> Cryptocurrency</label>
            //     <label className="radio-label d-flex flex-column px-4"><br /><div className="radio-div"><input className="radio" type="radio" name="selection" value="transactions" /></div> Transactions</label>
            //     <label className="radio-label d-flex flex-column px-4"><br /><div className="radio-div"><input className="radio" type="radio" name="selection" value="friends" /></div> Friends</label>

            // </div>

            <form className="form">
                <ol className="nodes">
                    <li className="node">
                        <input className="form__radio" type="radio" id="r1" name="radio-set" checked/>
                        <label className="form__label" for="r1"><span className="indicator">1</span></label>
                    </li>
                    <li className="node">
                        <input className="form__radio" type="radio" id="r2" name="radio-set" />
                        <label className="form__label" for="r2"><span className="indicator">2</span></label>
                    </li>
                    <li className="node">
                        <input className="form__radio" type="radio" id="r3" name="radio-set"/>
                        <label className="form__label" for="r3"><span className="indicator">3</span></label>
                    </li>
                    <li className="node">
                        <input className="form__radio" type="radio" id="r4" name="radio-set"/>
                        <label className="form__label" for="r4"><span className="indicator">4</span></label>
                    </li>
                    <li className="node">
                        <input className="form__radio" type="radio" id="r5" name="radio-set"/>
                        <label className="form__label" for="r5"><span className="indicator">5</span></label>
                    </li>
                </ol>
            </form>

        );
    }
}
                        
export default Settings;
