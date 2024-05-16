import React, { useState, useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import essay from "./text/essay.txt";
import proof from "./text/proof.txt";

function App() {
  const [num, setNum] = useState(1);
  const [facts, setFacts] = useState([]);
  const [nextPage, setNextPage] = useState("");
  const cardsRef = useRef([]);
  const [essayText, setEssayText] = useState("");
  const [essayProof, setEssayProof] = useState("");
  const [pressed, isPressed] = useState(false);
  const [info, isInfo] = useState(false);

  useEffect(() => {
    async function fetchFiles() {
      const responseEssay = await fetch(essay);
      const textEssay = await responseEssay.text();
      setEssayText(textEssay);

      const responseProof = await fetch(proof);
      const textProof = await responseProof.text();
      setEssayProof(textProof);
    }

    fetchFiles();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const url = `https://chicken-facts.p.rapidapi.com/facts/order/id/asc/page/${num}.json`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "1fece9cd46msh18f98aab476cdbfp1ac901jsnd793ec542456",
          "X-RapidAPI-Host": "chicken-facts.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setFacts((prevFacts) => [...prevFacts, ...data.facts]);
        setNextPage(data.next);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [num]);

  const loadNextPage = () => {
    setNum(num + 1);
    if (num >= 5) {
      setNum(num - 4);
    }
  };

  const handleScroll = () => {
    if (cardsRef.current[0]) {
      const { scrollLeft, scrollWidth, clientWidth } =
        cardsRef.current[0].parentElement;

      // Check if the scroll position is at the end
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        loadNextPage();
      }
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.68,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    cardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) {
          observer.unobserve(card);
        }
      });
    };
  }, [facts]);

  return (
    <div className="App">
      <div className="center">
        <h1>Fun Facts and Intresting Questions</h1>
      </div>
      <div className="whiteBox">
        <h2>Quick Look</h2>
        <p>Understanding people is the same thing as understanding chickens. There are plenty of places to look for information on people, so why also look into the interactions people have with chickens? This reaserch paper goes in depth on why people should look twords chickens to better look at themselves.</p>
      </div>
      <div className="whiteBox">
        <h2>Exploring Peoples Ideologies With Chickens</h2>
        <p>
          Chickens are not usually considered to be the center of very serious
          topics. This idea is especially true if that very topic is meant to be
          about someone's spiritual beliefs or ideals. Depending on where you
          live, you might think of chickens as just domesticated meat and egg
          sources, or an annoyance commonly found all around, maybe even as a
          source of entertainment. These are all examples of physical
          connotations we have for chickens. There aren't, of course, just
          physical connotations associated with chickens, but also more
          emotional connotations too. Throughout thousands of years of human
          advancements chickens have been known to be gentle, powerful,
          dangerous, fearful, fearless, tender (in multiple ways), honorable,
          mischievous creatures. The list goes on, but how can there be so many
          emotional and physical connections associated with chickens? Where do
          these associations stem from? Are people simply projecting their
          emotions onto chickens? The natural conclusion here is that chickens
          are obviously mirrors into humanity's souls! This statement is false,
          but in this paper I hope to give you the information needed to better
          understand people's complex relationship with chickens, so we can
          better understand ourselves. To be more clear, I am here to answer the
          all important question: what ideals can we learn about cultures,
          religions, and ultimately ourselves by comparing our values and
          actions to our beliefs or use of chickens?
        </p>
      </div>
      <div className="buttons">
        {pressed ? (
          <button className="mainInfo" onClick={() => isPressed(!pressed)}>
            <h2>A Mirror Made of Feathers</h2>
            <p>{essayText}</p>
          </button>
        ) : (
          <button className="mainInfoEmpty" onClick={() => isPressed(!pressed)}>
            Full Text
          </button>
        )}
        {info ? (
          <button className="mainInfo" onClick={() => isInfo(!info)}>
            <h2>References</h2>
            <p className="sourceEntry">{essayProof}</p>
          </button>
        ) : (
          <button className="mainInfoEmpty" onClick={() => isInfo(!info)}>
            Sources
          </button>
        )}
      </div>
      <div className="cardsDisplay">
        <i className="fa-solid fa-arrow-right-long"> Fun Facts</i>
        <div className="cards" onScroll={handleScroll}>
          {facts.map((fact, index) => (
            <div
              key={`${fact.id}-${index}`}
              className="card"
              ref={(el) => (cardsRef.current[index] = el)}
            >
              <div className="topCard">
                <i className="fa-solid fa-egg"></i>
                <h3>{fact.fact}</h3>
              </div>
              <div className="info">
                <h5>
                  Source:{" "}
                  <a
                    href={fact.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {fact.source}
                  </a>
                </h5>
                <h6>Published: {fact.published}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
