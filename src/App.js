import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, useLocation } from 'react-router-dom';

// Called sometime after postMessage is called
function receiveMessage(event:MessageEvent)
{
  if (event.data && (
    event.data.source && event.data.source.includes('devtools')
  ))
    return;
  console.log(event);
//
//   // Do we trust the sender of this message?
//   if (event.origin !== "*")
//     return;
//
//   // event.source is window.opener
//   // event.data is "hello there!"
//
//   // Assuming you've verified the origin of the received message (which
//   // you must do in any case), a convenient idiom for replying to a
//   // message is to call postMessage on event.source and provide
//   // event.origin as the targetOrigin.
//   event.source.postMessage("hi there yourself!  the secret response " + "is: rheeeeet!", event.origin);
}

window.addEventListener("message", receiveMessage, false);
window.opener.postMessage('ready', window.opener);

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
