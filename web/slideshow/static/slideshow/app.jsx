class Slideshow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 1,
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
