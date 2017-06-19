import React, {Component} from 'react';
import TabBlock from "./TabBlock";

export default class TabData extends Component {
    render() {
        return (
            <div>
                {this.props.tabData.map((data, ind) => (
                    <TabBlock
                        data={data}
                        key={ind}
                    />
                ))}
            </div>
        )
    }
}
