import React, {Component} from 'react';

export default class TabData extends Component {
    degreeToDirection(deg) {
        var temp = parseInt((deg / 22.5) + 0.5);
        var directions = ["С", "ССВ", "СВ", "ВСВ", "В", "ВЮВ", "ЮВ", "ЮЮВ", "Ю", "ЮЮЗ", "ЮЗ", "ЗЮЗ", "З", "ЗСЗ", "СЗ", "ССЗ"];
        return directions[temp % 16];
    }

    render() {
        return (
            <div className="tab_data">
                <div className="row">
                    <div className="day_of_week">{this.props.data.dayOfWeek}, {this.props.data.dayMonth}</div>
                </div>
                {this.props.data.elem.map((elem, ind) => (
                    <div className="row" key={ind}>
                        <div className="col-md-2 col-sm-2 col-xs-2 day_img"><img
                            src={`view/images/${elem.weather[0].icon}.png`}/></div>
                        <div className="col-md-2 col-md-offset-1 col-sm-2 col-sm-offset-1 col-xs-2 day_temp">
                            <div className="temp_day">{Math.floor(elem.main.temp)} &deg;C</div>
                            <div>{elem.dt_txt.substr(11, 5)}</div>
                        </div>
                        <div className="col-md-4 col-sm-4 col-xs-5">
                            <div className="pressure">Давление: {Math.floor(elem.main.pressure * 0.750064)} мм.
                                рт. ст.
                            </div>
                            <div className="wind_speed">Скорость ветра: {elem.wind.speed} м/с,</div>
                            <div className="wind_direction">{this.degreeToDirection(elem.wind.deg)}</div>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-3">
                            <div className="humidity">{elem.main.humidity}%</div>
                            <div>Влажность</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

