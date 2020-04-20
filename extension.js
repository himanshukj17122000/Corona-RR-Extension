// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const axios = require("axios").default;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "positive19" is now active!');
  var responseNumber;
  const myStatusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  myStatusBar.command = "extensions.helloWorld";
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  function APICall(value) {
    // setInterval(function () {
    axios.get(`https://api.covid19api.com/summary`).then((response) => {
      var c = response.data.Countries;
      responseNumber = c.find((o) => o.Country === value);
      // responseNumber = "Hello";
      changeText(value);
    });
    // }, 5000);
  }

  function changeText(value) {
    if (responseNumber != undefined) {
      var percent = Math.floor(
        (responseNumber.TotalRecovered / responseNumber.TotalConfirmed) * 100
      );
      myStatusBar.text =
        "Recovered: " +
        responseNumber.TotalRecovered +
        "   Recovery Rate: " +
        percent +
        "%";
      myStatusBar.show();
    }
  }
  let disposable = vscode.commands.registerCommand(
    "positive19.helloWorld",
    function () {
      // The code you place here will be executed every time your command is executed
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      var dateForToday = yyyy + "-" + mm + "-" + dd + "T00:00:00Z";
      console.log(mm);
      vscode.window.showInputBox().then((value) => {
        if (value == undefined) {
          value = "Global";
        }
        if (value == "Global" || value == "global") {
          axios.get(`https://api.covid19api.com/summary`).then((response) => {
            responseNumber = response.data.Global;
            var percent = Math.floor(
              (responseNumber.TotalRecovered / responseNumber.TotalConfirmed) *
                100
            );
            value = value.toString();
            myStatusBar.text =
              "Recovered: " +
              responseNumber.TotalRecovered +
              "   Recovery Rate: " +
              percent +
              "%";
            myStatusBar.show();
          });
        } else {
          if (
            value == "United States Of America" ||
            value == "USA" ||
            value == "America" ||
            value == "america" ||
            value == "usa"
          ) {
            value = "United States of America";
          }
          value = value[0].toUpperCase() + value.slice(1);
          axios.get(`https://api.covid19api.com/summary`).then((response) => {
            var c = response.data.Countries;
            value = value.toString();
            responseNumber = c.find((o) => o.Country === value);
            var percent = Math.floor(
              (responseNumber.TotalRecovered / responseNumber.TotalConfirmed) *
                100
            );
            myStatusBar.text =
              "Recovered: " +
              responseNumber.TotalRecovered +
              "   Recovery Rate: " +
              percent +
              "%";
            myStatusBar.show();
          });
        }
        var countryName = "";
        countryName = value.toString();
        setInterval(function () {
          APICall(countryName);
        }, 10000000);
      });
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
