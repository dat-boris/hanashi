/* global HANASHI $ */

import React, { Component } from 'react';
import './App.css';

// const IMAGE_LIST = [
//   'https://farm9.staticflickr.com/8739/28541841135_1663697a8f_m.jpg',
//   'https://farm9.staticflickr.com/8844/28257961940_771f24dca4_m.jpg',
//   'https://farm9.staticflickr.com/8846/28257966570_98c0f49207_m.jpg'
// ]

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentImageSRC: '',
      totalImageCount: 0,
      curentImagePosition: 0,
      imageList: []
    };

    this.toNextImage = this.toNextImage.bind(this);
    this.toPreviousImage = this.toPreviousImage.bind(this);

    this.socket = new WebSocket(
      `ws://${HANASHI.WEB_SOCKET_HOST}/ws/s/test/`
    )
  }

  componentDidMount(){
    const self = this;

    // load images
    // API explorer: https://www.flickr.com/services/api/explore/flickr.photosets.getPhotos
    $.getJSON(
        'https://api.flickr.com/services/rest/?jsoncallback=?',
        {
            'method': 'flickr.photosets.getPhotos',
            'api_key': HANASHI.API_KEY,
            'user_id': HANASHI.USER_ID,
            'photoset_id': HANASHI.GALLERY_ID,
            'extras': 'url_m',
            'format': 'json'
        },
        (data) => {
          if (data.stat == 'fail') {
            throw `Error: ${data.message}`
          }

          const photoURLs = data.photoset.photo.map((p) => p.url_m);
          self.setState({
            imageList: photoURLs,
            totalImageCount: photoURLs.length,
            currentImageSRC: photoURLs[this.state.curentImagePosition]
          });
        }
      );

    this.socket.onmessage = function(e) {
      const data = JSON.parse(e.data);
      console.log('[WS] Received message:', data);
      self.setState(data);
    };
  }

  toNextImage(){
    const newPosition = (this.state.curentImagePosition + 1) % this.state.totalImageCount;
    this._sendUpdateState(newPosition);
  }

  toPreviousImage(){
    const newPosition = (
      (this.state.totalImageCount + this.state.curentImagePosition - 1)
      % this.state.totalImageCount
    );
    this._sendUpdateState(newPosition);
  }

  _sendUpdateState(newPosition){
    const newState = {
      currentImageSRC: this.state.imageList[newPosition],
      curentImagePosition: newPosition
    };
    this.setState(newState);
    this.socket.send(JSON.stringify(newState));
  }

  render() {
    return (
      <div className="slideshow">
        <div onClick={this.toPreviousImage} className="scroll-left scroll-button blackshadow">
          <i className="fas fa-caret-left"></i>
        </div>
        <div className="image">
          <img src={this.state.currentImageSRC}/>
        </div>
        <div onClick={this.toNextImage} className="scroll-right scroll-button blackshadow">
          <i className="fas fa-caret-right"></i>
        </div>
        <div className="image-counter blackshadow">
          <span className="major-count">{this.state.curentImagePosition + 1}</span>
          <span>/ {this.state.totalImageCount}</span>
        </div>
      </div>
    );
  }
}

export default App;
