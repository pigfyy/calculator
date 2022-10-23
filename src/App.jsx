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

  const [display, setDisplay] = useState("");
  const [equation, setEquation] = useState([]);

  function keyPressed(keyValue, keyClass) {
    if (keyValue.length > 10) return;
    if (keyClass.includes("operator")) {
      if (equation[0] === "Error") return;
      setEquation((equation) => {
        let s;
        if (display === "") {
          if (equation.length === 0) return equation;
          s = [...equation.slice(0, -1)];
        } else {
          s = [...equation, removeCommas(display)];
        }
        if (keyValue === "=") {
          const res = eval(s.join(""));
          const roundedRes = Math.round(res * 1000000000) / 1000000000;
          if (roundedRes.toString().length > 9) {
            const t = roundedRes.toExponential(3);
            setDisplay(t);
            return [t];
          }
          setDisplay(addCommas(roundedRes));
          return [roundedRes];
        }
        setDisplay("");
        if (keyValue === "x") {
          return [...s, "*"];
        }
        if (keyValue === "÷") {
          return [...s, "/"];
        }
        return [...s, keyValue];
      });
    } else {
      setDisplay((prev) => {
        if (prev === "Error") {
          setEquation([]);
          return keyValue;
        }
        let ret = removeCommas(prev + keyValue);
        if (onlyNumbers(ret).length > 9) {
          setEquation(["Error"]);
          return "Error";
        }
        return addCommas(ret);
      });
    }

    function addCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function removeCommas(x) {
      return x.toString().replace(/,/g, "");
    }

    function onlyNumbers(string) {
      return string.replace(/[^0-9]/g, "");
    }
  }

  // adjust font size

  const fontSize = {
    fontSize: display.length < 8 ? "5.5rem" : `${5.5 - display.length / 7}rem`,
  };

  return (
    <section
      className="calculator"
      style={
        size.width * 16 > size.height * 9 ? whenWidthLarger : whenWidthSmaller
      }
    >
      <h1 className="display" style={fontSize}>
        {display}
      </h1>
      <Keys
        keyPressed={(keyValue, keyClass) => keyPressed(keyValue, keyClass)}
      />
    </section>
  );
}
