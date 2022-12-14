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

    // add commas to numbers

    function addCommas(x) {
      // seperate x after decimal point
      let [whole, decimal] = x.toString().split(".");
      // add commas to whole number
      whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      // return whole number and decimal
      return x.toString().includes(".") ? whole + "." + decimal : whole;
    }

    // ------------------------------------------------------------

    keyValue = convertToOperator(keyValue);

    setEquation((prevEquation) => {
      // if background is pressed, do nothing
      if (keyClass === "keys") {
        return prevEquation;
      }

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
        // if result is undefined, empty equation and set first element to keyValue
        if (curIndex === 0 && equation.length > 1) {
          equation = [];
          equation[0] = keyValue;
          curIndex = 0;

          // if equation is currently empty or current index of equation is simply 0, replace 0 with the key pressed
        } else if (equation[curIndex] === "0" || equation.length === 0) {
          equation[curIndex] = keyValue;

          // if current index of equation is -00, replace -00 with -(key pressed)
        } else if (equation[curIndex] === "-00") {
          equation[curIndex] = "-" + keyValue;

          // increment curIndex if the last index of equation is an operator
        } else if (isOperator(equation[curIndex])) {
          curIndex++;
          equation[curIndex] = keyValue;

          // if the last index of equation is a number, add the key pressed to the end of the number
        } else if (equation[curIndex] !== "-0") {
          equation[curIndex] += keyValue;
        }

        // if key is an operator
      } else if (isOperator(keyValue)) {
        // only add operator if equation is not empty
        if (equation.length !== 0) {
          // if curIndex is 0 and equation length is larger then 1, set equation to [equation[0], keyValue]
          if (curIndex === 0 && equation.length > 1) {
            equation = [equation[0], keyValue];
            curIndex = 1;

            // if the last index of equation is an operator, replace it with the key pressed
          } else if (isOperator(equation[curIndex])) {
            equation[curIndex] = keyValue;

            // if equation is not empty, add the key pressed to the end of the equation
          } else {
            curIndex++;
            equation[curIndex] = keyValue;
          }
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
          result = eval(equation.join("").replace(/-00/g, "-0"));
          result == "Infinity"
            ? (equation = [])
            : (equation = [result.toString(), ...equation.slice(1)]);
          curIndex = 0;
        }

        // if key is C
      } else if (keyValue === "C") {
        // if last index of equation is a number, delete the last index of equation
        if (
          equation[curIndex] !== undefined &&
          !isOperator(equation[curIndex])
        ) {
          // remove last index of equation
          equation.pop();
          curIndex !== 0 && curIndex--;
        }
      } else if (keyValue === "AC") {
        // clear the equation
        equation = [];
        curIndex = 0;
      } else if (keyValue === ".") {
        if (equation.length === 0) {
          equation[curIndex] = "0.";
        } else if (!equation[curIndex].includes(".")) {
          if (isOperator(equation[curIndex])) {
            curIndex++;
            equation[curIndex] = "0.";
          } else {
            equation[curIndex] += ".";
          }
        }
      } else if (keyValue === "%") {
        if (equation.length !== 0) {
          let index = curIndex;
          if (isOperator(equation[curIndex])) {
            index = curIndex - 1;
          }
          equation[index] = (equation[index] / 100).toString();
        }
      } else if (keyValue === "+/-") {
        if (equation.length === 0) {
          equation[curIndex] = "-00";
        } else if (isOperator(equation[curIndex])) {
          curIndex++;
          equation[curIndex] = "-00";
        } else if (equation[curIndex] === "0") {
          equation[curIndex] = "-00";
        } else {
          equation[curIndex] = (equation[curIndex] * -1).toString();
        }
      }

      // determine display
      // if result is defined, display result
      if (result || result === 0) {
        display = result;

        // if equation is empty, display 0
      } else if (equation.length === 0) {
        display = "0";

        // if last index of equation is "-00", display "-0"
      } else if (
        equation[curIndex] === "-00" ||
        equation[curIndex - 1] === "-00"
      ) {
        display = "-0";

        // if equation length is one, display the first index of equation
      } else if (equation.length === 1) {
        display = equation[0];

        // if last index of equation is + or -, display current result
      } else if (
        (equation.length > 3 &&
          (equation[curIndex] === "+" || equation[curIndex] === "-")) ||
        ((equation[curIndex] === "*" || equation[curIndex] === "/") &&
          equation[curIndex - 2] === "*") ||
        equation[curIndex - 2] === "/"
      ) {
        display = eval(equation.slice(0, curIndex).join(""));

        // if last index of equation isn't an operator, display last index of equation
      } else if (!isOperator(equation[curIndex])) {
        display = equation[curIndex];

        // if last index of equation is an operator, display the second to last index of equation
      } else {
        display = equation[curIndex - 1];
      }

      // format display
      // if display with only numbers is short enough, simply add commas
      if (display.toString().replace(/[^0-9]/g, "").length < 10) {
        display = addCommas(display);

        // if displays value is larger then 999999999, change display to a float and use e notation
      } else if (display > 999999999) {
        display = parseFloat(display).toExponential(3);

        // if display value is smaller than 0.000000001, use e notation
      } else if (display < 0.000000001) {
        display = parseFloat(display).toExponential(3);

        // if display value is between 0.000000001 and 999999999, round number to 9 digits and add commas
      } else {
        display = addCommas(parseFloat(display).toFixed(9));
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

  return (
    <section
      className="calculator"
      style={
        size.width * 16 > size.height * 9 ? whenWidthLarger : whenWidthSmaller
      }
    >
      <h1 className="display" style={fontSize}>
        {equation.display}
      </h1>
      <Keys
        keyPressed={(keyValue, keyClass) => keyPressed(keyValue, keyClass)}
        lastIndexOfEquation={equation.equation[equation.equation.length - 1]}
        whichClear={
          // if equation is empty, or if last index of equation is an operator, or if last index of equation is "-00", or if last index of equation is "0", or if last index of equation is "0." display "AC", else display "C"
          equation.equation.length === 0 || // if equation is empty
          isOperator(equation.equation[equation.equation.length - 1]) || // if last index of equation is an operator
          equation.equation[equation.equation.length - 1] === "-00" || // if last index of equation is "-00"
          equation.equation[equation.equation.length - 1] === "0" || // if last index of equation is "0"
          equation.equation[equation.equation.length - 1] === "0." // if last index of equation is "0."
            ? "AC"
            : "C"
        }
      />
    </section>
  );

  // check if string is an operator
  function isOperator(str) {
    return str === "+" || str === "-" || str === "*" || str === "/";
  }
}
