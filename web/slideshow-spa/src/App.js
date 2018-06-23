/* global HANASHI $ */

import React, { Component } from 'react';
import './App.css';

import QRCode from 'qrcode.react';

class ShareQRCode extends Component {
  render() {
    return (
      <div className="qrcode-expand">
        <QRCode value={window.location.href} size={256}/>
      </div>
    )
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentImageSRC: '',
      totalImageCount: 0,
      curentImagePosition: 0,
      imageList: [],
      isShowQR: false,
      zoomImage: false
    };

    this.toNextImage = this.toNextImage.bind(this);
    this.toPreviousImage = this.toPreviousImage.bind(this);
    this.toggleQRcode = this.toggleQRcode.bind(this);
    this.toggleZoom = this.toggleZoom.bind(this);

    this.socket = new WebSocket(
      `ws://${HANASHI.WEB_SOCKET_HOST}/ws/s/${HANASHI.ROOM_NAME}/`
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
            'extras': 'url_m,url_o',
            'format': 'json'
        },
        (data) => {
          if (data.stat == 'fail') {
            throw `Error: ${data.message}`
          }

          // Flickr can't display gif properly.
          // show original image if it is a GIF
          const getImageURL = (p) => (
            (p.url_o && p.url_o.endsWith('.gif')) ? p.url_o : p.url_m
          );

          const photoURLs = data.photoset.photo.map(getImageURL);
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

  toggleZoom(){
    this.setState({zoomImage: this.state.zoomImage ? '' : true})
  }

  toggleQRcode(){
    this.setState({isShowQR: this.state.isShowQR ? '' : true})
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
        <div onClick={this.toggleQRcode} className="share-widget">
          <i className="fas fa-qrcode"></i>
        </div>
        {this.state.isShowQR && <div onClick={this.toggleQRcode}><ShareQRCode/></div> }

        <div onClick={this.toPreviousImage} className="scroll-left scroll-button blackshadow">
          <i className="fas fa-caret-left"></i>
        </div>
        <div className="image"
            onClick={this.toggleZoom}
            >
          <img src={this.state.currentImageSRC} className={this.state.zoomImage && 'zoom'}/>
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
