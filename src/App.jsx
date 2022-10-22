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

  function keyPressed(e) {
    if (e.length > 10) return;
    setDisplay((prev) => {
      let ret = addCommas(removeCommas(prev + e));
      if (onlyNumbers(ret).length > 9) return "Error";
      return ret;
    });

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
      <Keys keyPressed={(e) => keyPressed(e)} />
    </section>
  );
}
