import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Tab from "./Tab";

const propTypes = {};

export default class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className='tabs'>
                <div className='row'>
                    <div className='col-md-1 col-sm-1 col-xs-1'/>
                    {this.props.tabs.map((tab, ind) => (
                        <Tab
                            date={tab.date}
                            dayWeatherIcon={tab.dayWeatherIcon}
                            dayWeatherTemp={tab.dayWeatherTemp}
                            dayOfWeek={tab.dayOfWeek}
                            key={ind}
                        />
                    ))}
                </div>
            </div>
        )
    }
}