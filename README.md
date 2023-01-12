# HAM Question Parser

## Installing & Running locally
This project relies on `pdftotext` to take the [PDF from NVCEV](http://www.ncvec.org/page.php?id=338) and parse it as a .txt file. That will need to be installed locally if you are going to run the Just command. I recommend doing this as it will also run the node script to then convert the .txt to JSON.

To run the `just` command yourself you can install `just` locally. Just is a command-line runner and instructions on installing can be found on the project's [github page](https://github.com/casey/just).  

You can also run the node script independently of just, but it needs to be given the path to a .txt version of the test pool from NCVEC.

`node covertToJSON.js ${path-to-file}.txt`

The node script was built on `v19.3.0`, but should still work for 16. The script also has no other js dependencies :-).

## JSON structure
An example of the JSON structure
```JSON
{
  "effectiveFromDate": "7/01/2022",
  "effectiveToDate": "6/30/2026",
  "questions": [
    {
      "question": "Which of the following is part of the Basis and Purpose of the Amateur Radio Service?",
      "id": "T1A01",
      "answer": "C",
      "options": {
        "A": "Providing personal radio communications for as many citizens as possible",
        "B": "Providing communications for international non-profit organizations",
        "C": "Advancing skills in the technical and communication phases of the radio art",
        "D": "All these choices are correct"
      }
    }
  ]
}
```