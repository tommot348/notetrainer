# Tool for training sightreading
## Dependencies
- pure css     -- for nicer looking buttons etc
- musical.js   -- for generating sound

## How to run
First you have to download the dependencies.
https://purecss.io/
https://github.com/PencilCode/musical.js/

This can be done (if you can run .sh files) by running `get-deps.sh`. The script needs npm and git to work

If you cannot run the script:
Pure goes into the folder css/pure
musical.min.js goes into the root folder

Then you have to deploy the whole folder to a webserver. If you have python installed you can run `python -m http.server` in the folder to start a webserver on localhost:8000