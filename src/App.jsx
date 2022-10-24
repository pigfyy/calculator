import Keys from "./assets/Keys";
import { useState, useEffect } from "react";

export default function () {
  // for calculator app size styles

  const whenWidthSmaller = {
    width: "80vw",
  };

  const whenWidthLarger = {
    width: ((useWindowSize().height * 0.8) / 16) * 9 + "px",
  };

  function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });

    useEffect(() => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      window.addEventListener("resize", handleResize);

      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
  }

  const size = useWindowSize();

  // for calculator app

  const [display, setDisplay] = useState({ show: "", isRes: false });
  const [equation, setEquation] = useState([]);
  const dis = display.show;

  function keyPressed(keyValue, keyClass) {
    // check if key is a number
    if (keyValue.length > 10) return;

    if (keyValue === "C") {
      setDisplay({ show: "", isRes: false });
      setEquation([]);
      return;
    }
    // check if key is an operator
    if (keyClass.includes("operator")) {
      const prevDisplay = removeCommas(dis);
      if (equation[0] === "Error") return;
      setEquation((equation) => {
        let s;
        // check if last key was an operator
        if (dis === "") {
          if (equation.length === 0) return equation;
          s = [...equation.slice(0, -1)];
        } else {
          s = [...equation, prevDisplay];
        }
        // display answer
        const res = eval(s.join(""));
        if (keyValue === "=") {
          // find answer
          // use exponential notation if answer is too big
          setDisplay({ show: res, isRes: true });
          return [];
        }
        setDisplay((prev) => ({ ...prev, isRes: true }));
        if (keyValue === "x") {
          return [...s, "*"];
        }
        if (keyValue === "÷") {
          return [...s, "/"];
        }
        setDisplay({ show: res, isRes: true });
        return [res, keyValue];
      });
    } else {
      setDisplay((prev) => {
        if (prev.isRes) return { show: keyValue, isRes: false };
        return { show: prev.show + keyValue, isRes: false };
      });
    }

    function removeCommas(x) {
      return x.toString().replace(/,/g, "");
    }
  }

  console.log(`equation: ${equation.join("")} || display: ${dis}`);

  // adjust font size

  const fontSize = {
    fontSize: dis.length < 8 ? "5.5rem" : `${5.5 - dis.length / 7}rem`,
  };

  // add commas to numbers

  function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <section
      className="calculator"
      style={
        size.width * 16 > size.height * 9 ? whenWidthLarger : whenWidthSmaller
      }
    >
      <h1 className="display" style={fontSize}>
        {dis.toString().length > 9
          ? parseFloat(dis).toExponential(4)
          : addCommas(dis)}
      </h1>
      <Keys
        keyPressed={(keyValue, keyClass) => keyPressed(keyValue, keyClass)}
      />
    </section>
  );
}
