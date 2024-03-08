async function main(data) {
  console.time();

  importScripts('//cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');

  console.time('base64');

  // This is a hardcoded example because JS running on file:// can't use fetch.

  const bfs_municipality_and_tax_data = await (await fetch('bfs_municipality_and_tax_data.csv', { mode: 'cors' })).text();
  const randomforest_regression = await (await fetch('randomforest_regression.pkl', { mode: 'cors' })).arrayBuffer();

  console.log(bfs_municipality_and_tax_data);
  
  console.timeEnd('base64');
  console.time('pyodide');

  console.log("Starting Pyodide...");

  let pyodide = await loadPyodide({
    packages: ['pandas', 'scikit-learn'],
  });

  console.timeEnd('pyodide');
  console.time('files');

  console.log("Importing files...");

  pyodide.FS.writeFile('bfs_municipality_and_tax_data.csv', bfs_municipality_and_tax_data, { encoding: 'utf8' });

  const randomforest_regression_ia = new Uint8Array(randomforest_regression);
  pyodide.FS.writeFile('randomforest_regression.pkl', randomforest_regression_ia);

  console.timeEnd('files');
  console.time('model');

  const { bfs_number, area, rooms } = data;

  console.log("Running model...");

  pyodide.runPython(`
    import pandas as pd
    from sklearn.ensemble import RandomForestRegressor
    import pickle
    import os

    bfs_number = int(${bfs_number})
    area = float(${area})
    rooms = float(${rooms})

    df_bfs_data = pd.read_csv('bfs_municipality_and_tax_data.csv', sep=',', encoding='utf-8')
    df_bfs_data['tax_income'] = df_bfs_data['tax_income'].str.replace("'", "")
    df = df_bfs_data[df_bfs_data['bfs_number']==bfs_number]

    randomforest_model = RandomForestRegressor()
    model_filename = "randomforest_regression.pkl"
    with open(model_filename, 'rb') as f:
        randomforest_model = pickle.load(f)

    prediction = randomforest_model.predict([[rooms, area, df['pop'].iloc[0], df['pop_dens'].iloc[0], df['frg_pct'].iloc[0], df['emp'].iloc[0], df['tax_income'].iloc[0], area/rooms]])
    result = str(round(prediction[0],2))
  `);

  const result = pyodide.globals.get('result');

  console.timeEnd('model');
  console.timeEnd();

  return result;
}

onmessage = (e) => {
  main(e.data).then((result) => postMessage(result));
};
