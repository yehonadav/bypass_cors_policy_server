import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, useLocation } from 'react-router-dom';
import axios, {AxiosResponse, AxiosError} from 'axios'

const protocol = 'bcps';

const actions = {
  window_is_ready: 'window_is_ready',
  axios_request: 'axios_request',
};

// Called sometime after postMessage is called
async function Xmessage(event:MessageEvent)
{
  // // Do we trust the sender of this message?
  // if (event.origin !== "*")
  //   return;
console.log(event);
  // ignore non bcps protocol events
  if (!(event.data && event.data.protocol === protocol))
    return;

  const action = event.data.action;
  const data = event.data.data;

  const send = (action, response) => event.source.postMessage({protocol, action, response}, event.origin);

  // window is ready
  if (action === actions.window_is_ready)
    return send(action, true);

  // send axios request
  if (action === actions.axios_request) {
    let res: AxiosResponse;
    try {
      res = await axios(data.config)
    } catch (error) {
      const e: AxiosError = error;
      res = {
        config: e.config ? e.config : data.config,
        code: e.code ? e.code : 500,
        request: e.request ? e.request : null,
        response: e.response ? e.response : `${e}`,
        isAxiosError: e.isAxiosError ? e.isAxiosError : false,
        requestFailed: true,
      };
    }
    return send(action, {id: data.id, response: JSON.parse(JSON.stringify(res))});
  }

  // request is not supported
  return event.source.postMessage({protocol, send_axios_response: true, error: true, errorMessage: 'request is not supported'}, event.origin);
}

window.addEventListener("message", Xmessage, false);


function Home() {
  // const match = useRouteMatch();
  // const location = useLocation();
  // console.log('match', match);
  // const data = new URLSearchParams(location.search).get("data");
  // console.log('parse data', JSON.parse(data));
  return (
    <div>
      listening...
      {/*{data}*/}
    </div>
  )
}

function App() {
  // need a /?
  // const url = new URL("http://a.b");

  // If your expected result is "http://foo.bar/?x=1&y=2&x=42"
  // url.searchParams.set('data', JSON.stringify({type:'search', keywords:['1','2','3','4']}));

  // console.log('url parsing:', JSON.parse(url.searchParams.get('data')));
  // console.log('url params:', url.search);
  // console.log('url href:', url.href);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path='/'>
          <Home/>
        </Route>
      </Switch>
    </Router>
  )

}

export default App;
