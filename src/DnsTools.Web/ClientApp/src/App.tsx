import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {HubConnectionBuilder} from '@microsoft/signalr';

import useIpData from './hooks/useIpData';
import {Config} from './types/generated';
import SignalrContext from './SignalrContext';

import DnsLookup from './pages/DnsLookup';
import DnsTraversal from './pages/DnsTraversal';
import Index from './pages/Index';
import Ping from './pages/Ping';
import Traceroute from './pages/Traceroute';

type Props = {
  config: Readonly<Config>;
};

const connection = new HubConnectionBuilder()
  .withUrl('/hub')
  .withAutomaticReconnect()
  .build();

const App: React.FC<Props> = (props: Props) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    connection
      .start()
      .then(() => setIsConnected(true))
      .catch(err => alert('Could not connect: ' + err.message));
    return () => {};
  }, []);

  const ipData = useIpData(connection);
  return (
    <SignalrContext.Provider value={{connection, isConnected}}>
      <Router>
        <div className="container">
          <Switch>
            <Route
              path="/"
              exact
              render={routeProps => (
                <Index {...routeProps} config={props.config} />
              )}
            />
            <Route
              path="/lookup/:host/:type/"
              render={routeProps => (
                <DnsLookup {...routeProps} config={props.config} />
              )}
            />
            <Route
              path="/traversal/:host/:type/"
              render={routeProps => (
                <DnsTraversal {...routeProps} config={props.config} />
              )}
            />
            <Route
              path="/ping/:host/"
              render={routeProps => (
                <Ping {...routeProps} config={props.config} />
              )}
            />
            <Route
              path="/traceroute/:host/"
              render={routeProps => (
                <Traceroute
                  {...routeProps}
                  config={props.config}
                  ipData={ipData}
                />
              )}
            />
          </Switch>
        </div>
      </Router>
    </SignalrContext.Provider>
  );
};

export default App;
