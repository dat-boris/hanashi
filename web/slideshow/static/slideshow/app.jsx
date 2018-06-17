IMAGE_LIST = [
  'https://scontent-sjc3-1.cdninstagram.com/vp/a86cf0ea72b5de88f3c48dd8ce0432a1/5BB2A231/t51.2885-15/s640x640/sh0.08/e35/34198580_219946918786046_5834637926868189184_n.jpg 640w,https://scontent-sjc3-1.cdninstagram.com/vp/360aa121e9385e21d2aa8e336c4cc117/5BB6761C/t51.2885-15/s750x750/sh0.08/e35/34198580_219946918786046_5834637926868189184_n.jpg 750w,https://scontent-sjc3-1.cdninstagram.com/vp/6a48fc17ae7001cccecd366cd3f2017d/5BB07150/t51.2885-15/e35/34198580_219946918786046_5834637926868189184_n.jpg 1080w',
  'https://scontent-sjc3-1.cdninstagram.com/vp/ba7e3791d3ff2b8ccfafe59269f46ac7/5BC2346E/t51.2885-15/s640x640/sh0.08/e35/33904598_174009736781913_5821186956880510976_n.jpg 640w,https://scontent-sjc3-1.cdninstagram.com/vp/a1194890c59571ce2e538ae0aed753db/5B9F5743/t51.2885-15/s750x750/sh0.08/e35/33904598_174009736781913_5821186956880510976_n.jpg 750w,https://scontent-sjc3-1.cdninstagram.com/vp/e3ccd921d67badfd04ab8d6e426761ea/5BA7EB0F/t51.2885-15/e35/33904598_174009736781913_5821186956880510976_n.jpg 1080w'
]

class Slideshow extends React.Component {

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
      'ws://' + window.location.host +
      '/ws/s/test/');
  }

  componentDidMount(){
    const self = this;
    this.socket.onmessage = function(e) {
      var data = JSON.parse(e.data);
      var message = data['message'];
      // document.querySelector('#chat-log').value += (message + '\n');
      self.setState({ value: message })
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

// ========================================

ReactDOM.render(
  <Slideshow />,
  document.getElementById('root')
);
