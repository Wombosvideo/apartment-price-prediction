# Apartment Price Prediction

This repository was made to showcase the possibility of running a machine
learning model **directly in the browser**.

[See the live demo](https://bosin.ch/apartment-price-prediction/) on my
personal website.

> **NOTE**: The municipalities available in the dropdown are currently
> hard-coded and limited to a few examples. This is due to the fact that this
> is only a showcase and not a full-fledged application.

## How it works

The source code is heavily based on [KI-Anwendungen-n-to-n-backend][1] and
inspired by [KI-Anwendungen-n-to-n-frontend][2] by [bkuehnis][3].

The Python code is mostly identical to the backend of the original project,
except that no Flask is used. Instead, the model is run with the help of
[Pyodide][4], a WebAssembly based distribution of Python. This is done in the
background using a Web Worker.

To get the model to work with Pyodide, the web worker fetches the required
`bfs_municipality_and_tax_data.csv` and `randomforest_regression.pkl` files
from the server and creates them as new files in the Pyodide environment. The
model is then run with the input data and the result is sent back to the main
thread. The result is then displayed on the website in a similar way to the
original project (can't check due to unavailability of the sample deployment).

[1]: https://github.com/bkuehnis/KI-Anwendungen-n-to-n-backend
[2]: https://github.com/bkuehnis/KI-Anwendungen-n-to-n-frontend
[3]: https://github.com/bkuehnis
[4]: https://pyodide.org/en/stable/
