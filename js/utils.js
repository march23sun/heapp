var formatNumber = function (num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

var convertToPercentage = function (decimal) {
  if (typeof decimal !== "number" || isNaN(decimal)) {
    return "0%";
    // throw new Error("Input must be a valid number");
  }

  var percentage = decimal * 100;
  var formattedPercentage;

  if (percentage === Math.floor(percentage)) {
    formattedPercentage = percentage.toFixed(0) + "%";
  } else {
    formattedPercentage = percentage.toFixed(2) + "%";
  }

  return formattedPercentage;
};

var getJSONFileData = function (filename) {
  if (typeof axios === "undefined") return;

  return axios
    .get("./testdata/" + filename + ".json")
    .then(function (response) {
      console.log("response", response);

      if (
        (response.statusText =
          "OK" && response.headers["content-type"] === "application/json")
      )
        return response.data;
      else throw Error("Error!");
    })
    .catch(function (error) {
      console.log("error", error);
      return false;
    });
};
