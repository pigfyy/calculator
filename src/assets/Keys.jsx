export default function (props) {
  return (
    <div
      className="keys"
      onClick={(e) => {
        props.keyPressed(e.target.innerText);
      }}
    >
      <button className="key top-row">C</button>
      <button className="key top-row">+/-</button>
      <button className="key top-row">%</button>
      <button className="key operator">÷</button>
      <button className="key">7</button>
      <button className="key">8</button>
      <button className="key">9</button>
      <button className="key operator">x</button>
      <button className="key">4</button>
      <button className="key">5</button>
      <button className="key">6</button>
      <button className="key operator">-</button>
      <button className="key">1</button>
      <button className="key">2</button>
      <button className="key">3</button>
      <button className="key operator">+</button>
      <button className="key stretch-two">0</button>
      <button className="key">.</button>
      <button className="key operator">=</button>
    </div>
  );
}
