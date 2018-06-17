var chatSocket = new WebSocket(
  'ws://' + window.location.host +
  '/ws/s/test/');

class Slideshow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
  }

  componentDidMount(){
    const self = this;
    chatSocket.onmessage = function(e) {
      var data = JSON.parse(e.data);
      var message = data['message'];
      // document.querySelector('#chat-log').value += (message + '\n');
      self.setState({ value: message })
    };
  }

  render() {
    return (
      <div className="usercount">
        <div>Last message:</div>
        <div>{this.state.value}</div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Slideshow />,
  document.getElementById('root')
);
