var chatSocket = new WebSocket(
  'ws://' + window.location.host +
  '/ws/s/test/');

class Slideshow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };

    chatSocket.onmessage = function(e) {
        // var data = JSON.parse(e.data);
        // var message = data['message'];
        // document.querySelector('#chat-log').value += (message + '\n');
        this.setState({ value: this.state.value + 1 })
    };
  }

  render() {
    return (
      <div className="usercount">
        <div>Number of users:</div>
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
