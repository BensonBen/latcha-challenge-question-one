import Moon from "moon";
const {
  div,
  img,
  h1,
  p,
  a,
  text,
  thead,
  tr,
  th,
  tbody,
  table,
  td,
  label,
  input,
} = Moon.view.m;
const { run } = Moon;

const parseResterauntData = (data) => {
  const { Restaurants: restaurants } = data;
  return (restaurants || []).map((restaurant) => {
    return {
      name: (restaurant.Name || "No Name").trim(),
      rating: restaurant.RatingStars || 0,
      foodType: (restaurant.CuisineTypes || [])
        .map((cuisineType) => `${cuisineType.Name || "None"}`.trim())
        .join(", "),
    };
  });
};

const onResterauntSearch = () => {
  run(({ data }) => {
    return {
      http: [
        {
          method: "GET",
          url:
            "https://cors-anywhere.herokuapp.com/" +
            `https://uk.api.just-eat.io/restaurants/bypostcode/${data.searchParmeters}`,
          responseType: "application/json",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          onLoad: ({ http, data }) => {
            const { body } = http;
            const resultSet = parseResterauntData(JSON.parse(body));
            return {
              view: restaurantView({
                ...data,
                searchResults: resultSet,
              }),
            };
          },
          onError: ({ data }) => {
            return {
              view: restaurantView({
                ...data,
                searchResults: [],
              }),
            };
          },
        },
      ],
    };
  });
};

const onInput = ({ data, view }) => {
  data.searchParmeters = view.target.value;
};

const restaurantView = (data) => {
  return div({
    id: "root",
    class:
      "d-flex justify-content-center align-items-center flex-direction-column m-2",
    children: [
      h1({
        children: [text({ data: data.title })],
      }),
      div({
        class: "row",
        children: [
          div({
            class: "twelve columns",
            children: [
              label({
                for: "ukAreaCodeInput",
                children: [text({ data: "UK Area Code" })],
              }),
              input({
                class: "u-full-width",
                type: "email",
                id: "ukAreaCodeInput",
                "@input": onInput,
              }),
            ],
          }),
          div({
            class: "twelve columns align-text-center",
            children: [
              input({
                class: "button-primary",
                type: "submit",
                value: "Submit",
                "@click": onResterauntSearch,
              }),
            ],
          }),
        ],
      }),
      table({
        class: "u-full-width",
        children: [
          thead({
            children: [
              tr({
                children: data.tableNames.map((tableName) =>
                  th({ children: [text({ data: tableName })] })
                ),
              }),
            ],
          }),
          tbody({
            children: data.searchResults.map((searchResult) =>
              tr({
                children: [
                  td({ children: [text({ data: searchResult.name })] }),
                  td({ children: [text({ data: searchResult.rating })] }),
                  td({
                    children: [text({ data: searchResult.foodType })],
                  }),
                ],
              })
            ),
          }),
        ],
      }),
    ],
  });
};

export default ({ data }) => restaurantView(data);
