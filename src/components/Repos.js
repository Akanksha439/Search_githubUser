import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);
  //console.log(repos);

  //counting how many times a language is present
  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    //if language is null then simply return total
    if (!language) return total;
    //check if language is in object,if not then add it in object
    //we used label and value becoz we need data in this format in Pie3D.js
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    }
    //if language is present then simply increase the count of lang
    else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    return total;
  }, {});
  //console.log(languages);

  //CALCULATE MOST USED LANG
  //now we want sort the objects whose language has more value/USED
  //also we will take only first five popular languages using slice method
  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    //we are overriding the value with stars number because we know doughnut2d
    //need data in label and value format and here we need value as stars value
    .map((item) => {
      return { ...item, value: item.stars };
    })
    .slice(0, 5);

  //stars, forks
  /*I am using reduce, I am returning object with two properties which
    are object itself,and i right away destructure them above */
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      //in total i am targetting stars and in stars create new property
      //chart looks for label and value therefore we create thses two prop
      //eg: 59: {label: 'js-cart-setup', value: 59}
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    {
      stars: {},
      forks: {},
    }
  );
  /*as we see stars on console they already in increasing order,so 
    we will slice last 5 objects and reverse them to get descending order*/
  stars = Object.values(stars).slice(-5).reverse();
  // console.log(stars);
  forks = Object.values(forks).slice(-5).reverse();

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
