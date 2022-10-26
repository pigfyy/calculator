// TODO: fix in the case of infinity

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

  const [equation, setEquation] = useState({
    equation: [],
    curIndex: 0,
    display: "0",
    result: undefined,
  });

  function keyPressed(keyValue, keyClass) {
    // functions: -------------------------------------------------

    // check if string is an operator
    function isOperator(str) {
      return str === "+" || str === "-" || str === "*" || str === "/";
    }

    // convert keyValue to an operator if it is one using a switch statement
    function convertToOperator(str) {
      switch (str) {
        case "x":
          return "*";
        case "÷":
          return "/";
        default:
          return str;
      }
    }

    // ------------------------------------------------------------

    keyValue = convertToOperator(keyValue);

    setEquation((prevEquation) => {
      // separate equation into array to access each element
      let [equation, curIndex, display, result] = [
        prevEquation.equation,
        prevEquation.curIndex,
        prevEquation.display,
        prevEquation.result,
      ];

      // if result is defined, set result to undefined
      if (result !== undefined) {
        result = undefined;
      }

      // if key is a number
      if (keyClass.includes("num")) {
        // if equation is currently empty or current index of equation is simply 0, replace 0 with the key pressed
        if (
          (keyValue !== "." && equation[curIndex] === "0") ||
          equation.length === 0
        ) {
          equation[curIndex] = keyValue;

          // increment curIndex if the last index of equation is an operator
        } else if (isOperator(equation[curIndex])) {
          curIndex++;
          equation[curIndex] = keyValue;

          // if the last index of equation is a number, add the key pressed to the end of the number
        } else {
          equation[curIndex] += keyValue;
        }

        // if key is an operator
      } else if (isOperator(keyValue)) {
        // if equation is currently empty, add 0 to the equation
        if (equation.length === 0) {
          equation[curIndex] = "0";
          curIndex++;

          // if the last index of equation is an operator, replace it with the key pressed
        } else if (isOperator(equation[curIndex])) {
          equation[curIndex] = keyValue;

          // if equation is not empty, add the key pressed to the end of the equation
        } else {
          curIndex++;
          equation[curIndex] = keyValue;
        }

        // if key is =
      } else if (keyValue === "=") {
        // if equation isn't empty, evaluate the equation
        if (equation.length !== 0) {
          // if the last index of equation is an operator, remove it
          if (isOperator(equation[curIndex])) {
            equation.pop();
          }

          // evaluate the equation
          result = eval(equation.join(""));
          result == "Infinity"
            ? (equation = [])
            : (equation = [result.toString()]);
          curIndex = 0;
        }

        // if key is C
      } else if (keyValue === "C") {
        // clear the equation
        equation = [];
        curIndex = 0;
      }

      // determine display
      // if result is defined, display result
      if (result || result === 0) {
        display = result;
        // if equation is empty, display 0
      } else if (equation.length === 0) {
        display = "0";
        // if equation length is one, display the first index of equation
      } else if (equation.length === 1) {
        display = equation[0];
        // if last index of equation is + or -, display current result
      } else if (
        equation.length > 3 &&
        (equation[curIndex] === "+" || equation[curIndex] === "-")
      ) {
        display = eval(equation.slice(0, curIndex).join(""));
        console.log(equation.slice(0, curIndex).join(""));
        // if last index of equation isn't an operator, display last index of equation
      } else if (!isOperator(equation[curIndex])) {
        display = equation[curIndex];
        // if last index of equation is an operator, display the second to last index of equation
      } else {
        display = equation[curIndex - 1];
      }

      return { equation, curIndex, display, result };
    });
  }

  // values
  console.log(
    `~~~\n\n\ncurIndex: ${equation.curIndex}, display: ${equation.display}, result: ${equation.result}`
  );
  console.log("equation:");
  console.log(equation.equation);

  // adjust font size

  const fontSize = {
    fontSize:
      equation.display.length < 8
        ? "5.5rem"
        : `${5.5 - equation.display.length / 7}rem`,
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
        {equation.display.toString().length > 9
          ? parseFloat(equation.display).toExponential(2)
          : addCommas(equation.display)}
      </h1>
      <Keys
        keyPressed={(keyValue, keyClass) => keyPressed(keyValue, keyClass)}
      />
    </section>
  );
}
