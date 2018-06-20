/* global HANASHI */

import React, { Component } from 'react';
import './App.css';

const IMAGE_LIST = [
  'https://farm9.staticflickr.com/8739/28541841135_1663697a8f_m.jpg',
  'https://farm9.staticflickr.com/8844/28257961940_771f24dca4_m.jpg',
  'https://farm9.staticflickr.com/8846/28257966570_98c0f49207_m.jpg'
]

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentImageSRC: IMAGE_LIST[0],
      totalImageCount: IMAGE_LIST.length,
      curentImagePosition: 0
    };

    this.toNextImage = this.toNextImage.bind(this);
    this.toPreviousImage = this.toPreviousImage.bind(this);

    this.socket = new WebSocket(
      `ws://${HANASHI.WEB_SOCKET_HOST}/ws/s/test/`
    )
  }

  componentDidMount(){
    const self = this;
    this.socket.onmessage = function(e) {
      const data = JSON.parse(e.data);
      console.log('[WS] Received message:', data);
      self.setState(data);
    };
  }

  toNextImage(){
    const newPosition = (this.state.curentImagePosition + 1) % IMAGE_LIST.length;
    this._sendUpdateState(newPosition);
  }

  toPreviousImage(){
    const newPosition = (IMAGE_LIST.length + this.state.curentImagePosition - 1) % IMAGE_LIST.length;
    this._sendUpdateState(newPosition);
  }

  _sendUpdateState(newPosition){
    const newState = {
      currentImageSRC: IMAGE_LIST[newPosition],
      curentImagePosition: newPosition
    };
    this.setState(newState);
    this.socket.send(JSON.stringify(newState));
  }

  render() {
    return (
      <div className="slideshow">
        <img src={this.state.currentImageSRC}/>
        <div>Image count:</div>
        <div>{this.state.curentImagePosition + 1} / {this.state.totalImageCount}</div>
        <a href="#" onClick={this.toNextImage}>&lt;</a>
        <a href="#" onClick={this.toPreviousImage}>&gt;</a>
      </div>
    );
  }
}

export default App;
