import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, useLocation } from 'react-router-dom';

// onmessage = (evt:MessageEvent) => {
//   // const port = evt.ports[0];
//   const port = evt.source;
//   const data = {...evt.data};
//   console.log(evt);
//   // fetch(data).then(res => {
//   //   // the response is not clonable
//   //   // so we make a new plain object
//   //   const obj = {
//   //     bodyUsed: false,
//   //     headers: [...res.headers],
//   //     ok: res.ok,
//   //     redirected: res.redurected,
//   //     status: res.status,
//   //     statusText: res.statusText,
//   //     type: res.type,
//   //     url: res.url
//   //   };
//   //   console.log(port);
//   //   port.postMessage(obj);
//   //
//   //   // Pipe the request to the port (MessageChannel)
//   //   const reader = res.body.getReader();
//   //   const pump = () => reader.read()
//   //     .then(({value, done}) => done
//   //       ? port.postMessage(done)
//   //       : (port.postMessage(value), pump())
//   //     );
//   //
//   //   // start the pipe
//   //   pump()
//   // })
// };

// // Called sometime after postMessage is called
function receiveMessage(event)
{
  console.log(event);
//
//   // Do we trust the sender of this message?
//   // if (event.origin !== "*")
//   //   return;
//
//   // event.source is window.opener
//   // event.data is "hello there!"
//
//   // Assuming you've verified the origin of the received message (which
//   // you must do in any case), a convenient idiom for replying to a
//   // message is to call postMessage on event.source and provide
//   // event.origin as the targetOrigin.
  event.source.postMessage("hi there yourself!  the secret response " +
    "is: rheeeeet!",
    event.origin);
}

window.addEventListener("message", receiveMessage, false);

// onmessage = (evt:MessageEvent) => {
//   console.log(evt);
//   evt.source.postMessage('sweet!')
// };

function Home() {
  const match = useRouteMatch();
  const location = useLocation();
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
