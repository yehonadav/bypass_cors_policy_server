import React, {useCallback, useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, useLocation } from 'react-router-dom';
import axios, {AxiosResponse, AxiosError} from 'axios'

const protocol = 'bcps';

const actions = {
  window_is_ready: 'window_is_ready',
  axios_request: 'axios_request',
  axios_requests: 'axios_requests',
};

const do_nothing_function = () => {};

const requests = {
  setEvents: do_nothing_function,
  events: [],
};

// Called sometime after postMessage is called
async function Xmessage(event:MessageEvent)
{
  // // Do we trust the sender of this message?
  // if (event.origin !== "*")
  //   return;

  // ignore non bcps protocol events
  if (!(event.data && event.data.protocol === protocol))
    return;

  const requestEvent = {
    event,
    response: null,
  };

  requests.setEvents([requestEvent, ...requests.events]);

  const action = event.data.action;
  const data = event.data.data;

  const send = (action, response) => {
    requestEvent.response = response;
    requests.setEvents([...requests.events]);
    event.source.postMessage({protocol, action, response}, event.origin);
  };

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

  // send axios requests
  if (action === actions.axios_requests) {
    const pending_responses = data.requests.map(config=>axios(config));
    const responses = [];
    for (let pend of pending_responses) {
      let res: AxiosResponse;
      try {
        res = await pend;
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
      responses.push(res);
    }
    return send(action, {id: data.id, response: JSON.parse(JSON.stringify(responses))});
  }

  // request is not supported
  requestEvent.response = 'request is not supported';
  requests.setEvents([...requests.events]);
  return event.source.postMessage({protocol, send_axios_response: true, error: true, errorMessage: requestEvent.response}, event.origin);
}

window.addEventListener("message", Xmessage, false);


function Home() {
  // const match = useRouteMatch();
  // const location = useLocation();
  // console.log('match', match);
  // const data = new URLSearchParams(location.search).get("data");
  // console.log('parse data', JSON.parse(data));
  const [events, setEvents] = useState(requests.events);

  requests.setEvents = useCallback((events) => {
    setEvents(events);
    requests.events = events;
  }, [setEvents]);

  return (
    <div>
      Please wait... Processing requests
      {events.map((requestEvent, index:number) => {
        const event:MessageEvent = requestEvent.event;
        const response = requestEvent.response;
        return (
          <>
            <div key={index}>event: {JSON.stringify(event.data)}</div>
            <div key={index}>response: {JSON.stringify(response)}</div>
            <br/>
          </>
        )
      })}
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
