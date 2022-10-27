export default function (props) {
  return (
    <div
      className="keys"
      onClick={(e) => {
        props.keyPressed(e.target.innerText, e.target.className);
      }}
    >
      <button className="key top-row">{props.whichClear}</button>
      <button className="key top-row">+/-</button>
      <button className="key top-row">%</button>
      <button
        className="key operator"
        data-is-current={props.lastIndexOfEquation === "/" ? "t" : ""}
      >
        ÷
      </button>
      <button className="key num">7</button>
      <button className="key num">8</button>
      <button className="key num">9</button>
      <button
        className="key operator"
        data-is-current={props.lastIndexOfEquation === "*" ? "t" : ""}
      >
        x
      </button>
      <button className="key num">4</button>
      <button className="key num">5</button>
      <button className="key num">6</button>
      <button
        className="key operator"
        data-is-current={props.lastIndexOfEquation === "-" ? "t" : ""}
      >
        -
      </button>
      <button className="key num">1</button>
      <button className="key num">2</button>
      <button className="key num">3</button>
      <button
        className="key operator"
        data-is-current={props.lastIndexOfEquation === "+" ? "t" : ""}
      >
        +
      </button>
      <button className="key num stretch-two">0</button>
      <button className="key">.</button>
      <button className="key operator">=</button>
    </div>
  );
}
