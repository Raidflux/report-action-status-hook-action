const axios = require("axios");
const core = require('@actions/core');

const secret = core.getInput('secret');
const secretHeader = core.getInput('secretHeader');
const url = core.getInput('url');
const dataInput = core.getInput('data');

const isEmpty = str => !str || str.trim() === "";

if (isEmpty(secret) || isEmpty(secretHeader)) {
  core.setFailed("Secret or Secret Header is missing");
  return;
}

function isJsonString(str) {
  try {
    const json = JSON.parse(str);
    return typeof json === "object";
  } catch (e) {
    return false;
  }
}


const data = isJsonString(dataInput) ? JSON.parse(dataInput) : dataInput;

axios.post(url, data, {
  headers: {
    [secretHeader]: secret,
    "Content-Type": "application/json"
  }
}).then(function () {
  core.info(`Webhook sent sucessfully`)
}).catch(function (error) {
  core.setFailed(`Request failed with status code ${error.response.status}`);
});