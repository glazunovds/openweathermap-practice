import React, {Component} from 'react';

export default class Tab extends Component {
    render() {
        return (
            <div className='tab col-md-2 col-sm-2 col-xs-2 hover' id={this.props.date}>
                <div className='weather_image'><img src={`view/images/${this.props.dayWeatherIcon}.png`}/></div>
                <div className='temp_day'>{this.props.dayWeatherTemp}</div>
                <div className='dayOfWeek'>{this.props.dayOfWeek}</div>
            </div>
        )
    }
}