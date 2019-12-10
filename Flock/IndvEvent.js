import React from 'react';

export default class IndvEvents extends React.Component {
    constructor(props){
        super(props);
        this.eventDescription = props.eventDescription;
        this.eventName = props.eventName;
        this.picture = props.picture;

    }

    render() {
        return (
          <div>
            <a> {this.eventName} </a> {this.eventDescription}<br />
          </div>
        );
      }
}