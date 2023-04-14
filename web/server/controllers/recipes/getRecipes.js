import axios from "axios";
import { readFile } from "fs";

const OPENAI_API_KEY = "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";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getRecipes = async (req, res) => {
  try {
    const { nights, servings, cuisine, protein, diets, ingredients, type } =
      req.body;

    if (!servings) {
      throw new Error("People serves or food types is required field.");
    }

    const currentDate = new Date();

    // const { servings, foodType, diets, ingredients } = req.query;

    // if (!servings && (!foodType || !diets || !ingredients)) {
    //   throw new Error("People serves or food types is required field.");
    // }

    // const currentDate = new Date();

    readFile(
      `server/prompts/${req.headers.shop}.txt`,
      "utf8",
      async (err, data) => {
        if (err) {
          return res.status(200).send({ error: "Prompt not found." });
        }

        // let replaceDiets = data.replace("<diets>", `${diets && ","}${diets}`);
        // let replaceServings = replaceDiets.replace("<servings>", `${servings}`);
        // let replaceFoodType = replaceServings.replace(
        //   "<foodType>",
        //   `${foodType}`
        // );
        // let replaceIngredients = replaceFoodType.replace(
        //   "<ingredients>",
        //   `${ingredients}`
        // );
        // let replaceCurrentDate = replaceIngredients.replace(
        //   "<currentMonth>",
        //   `${monthNames[currentDate.getMonth()]}`
        // );

        // const payload = {
        //   prompt: replaceCurrentDate,
        //   max_tokens: 2049,
        //   temperature: 0.5,
        //   model: "text-davinci-003", // gpt-3.5-turbo
        // };

        //   let _envPrompt = `Please provide five <cuisine> <dietary> <type> cuisine recipes that is suitable for <no_of_people> adults and includes <protein> protein sources. The ingredients should be listed in the metric system and using New Zealand terminology, and the instructions should also use New Zealand terminology.
        // Additionally, please include any nutritional
        // information and information on allergens. The
        // ingredients used in the recipes should be in season
        // in New Zealand, as it is currently the month of
        // <month>`;

        // replace prompt
        let replacePrompt = data
          .replace("<cuisine>", cuisine)
          .replace("<dietary>", diets)
          .replace("<type>", type)
          .replace("<no_of_people>", servings)
          .replace("<protein>", protein)
          .replace("<month>", monthNames[currentDate.getMonth()]);

        const payload = {
          prompt: replacePrompt,
          max_tokens: 2049,
          temperature: 0.5,
          model: "text-davinci-003", // gpt-3.5-turbo
        };

        await axios
          .post("https://api.openai.com/v1/completions", payload, {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            res
              .status(200)
              .send({ ...response.data, searchPrompt: replacePrompt });
          })
          .catch((error) => {
            res
              .status(200)
              .send({ error: error?.response?.data?.error || error });
          });
      }
    );
  } catch (error) {
    res.status(200).send({
      error: error,
    });
  }
};

export default getRecipes;
