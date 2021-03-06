import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderBoard() {
    let rows = []
    for (let i = 0; i < 3; i++) {
      let children = []
      for (let j = 0; j < 3; j++) {
        children.push(this.renderSquare(3 * i + j))
      }

      let row =
        <div className="board-row">
          {children}
        </div>
      rows.push(row)
    }
    return rows
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        last_row: Math.floor(i / 3) + 1,
        last_col: (i % 3) + 1,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,

    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + '. row ' + step.last_row + ' col ' + step.last_col :
        'Go to game start';
      if (this.state.stepNumber === move) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });



    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <TicTacForm />
        </div>
      </div>
    );
  }
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

//textarea component
class Textarea extends React.Component {

  static defaultProps = {
    value: ''
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string
  }

  state = {
    value: this.props.value
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <textarea id={this.props.id}
        name={this.props.name}
        defaultValue={this.state.value}
        onChange={this.handleChange} />
    );
  }
}

export class TicTacForm extends React.Component {
  
  handleSubmit = (e) => {
    e.preventDefault();
 
    console.log('submitting form. We need to validate it!');
  }

  render() {
    return(
      <form action="/myform" 
            method="post" 
            onSubmit={this.handleSubmit}>
       <Textarea />
       <input type="submit" value="Submit Form" />

      </form>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);
