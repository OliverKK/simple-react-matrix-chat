import React, { useEffect, useState } from 'react';

import sdk from 'matrix-js-sdk';

import logo from './logo.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState('');
  const [history, setHistory] = useState<Array<string>>([]);
  const [client, setClient] = useState(sdk.createClient({
    baseUrl: "https://matrix.org",
    accessToken: "MDAxOGxvY2F0aW9uIG1hdHJpeC5vcmcKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDI3Y2lkIHVzZXJfaWQgPSBAdHViZW1hbjI6bWF0cml4Lm9yZwowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IGN4MHF3Qm1oanVEUW8xS2IKMDAyZnNpZ25hdHVyZSBeal1AaTCbgzAxeljtPxps7Q7p8ldxS5lmefkFsTqljAo",
    userId: "@tubeman2:matrix.org"
  }));
  const testRoomId = "!OfmbiHrjMtrluvfDQg:matrix.org";

  /**
   *
   */
  useEffect(() => {

    setClient(client);

    client.startClient();

    client.once('sync', function(state:any, prevState:any, res:any) {
      //console.log(state); // state will be 'PREPARED' when the client is ready to use
    });

    client.on("event", function(event:any){
      const eventType = event.getType();

      if (eventType === 'm.typing') {
        const username = event.event.content.user_ids;
        setIsTyping(username ? `${username} is typing ...` : '');
      }
    })

    client.on("Room.timeline", function(event:any, room:any, toStartOfTimeline:any) {
      const currentMessage = event.event.content.body;
      setHistory([...history, currentMessage]);
    });

    const rooms = client.getRooms();
    rooms.forEach((room:any) => {
        console.log(room.roomId);
    });
  }, [client, history]);

  const handleOnClick = (e: any) => {
    var content = {
      "body": message,
      "msgtype": "m.text"
    };

    client.sendEvent(testRoomId, "m.room.message", content, "").then((res:any) => {
      // message sent successfully
      setMessage('');
    }).catch((err:any) => {
        console.log(err);
    })
  }

  const handleOnSendMessage = (e: any) => {
    setMessage(e.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {
            history.map((m) => {
                return <>
                  <span key={m}>{m}</span>
                  <br />
                </>
            })
          }
        </p>
        <p>
          <textarea onChange={handleOnSendMessage} value={message} />
          <button onClick={(e) => handleOnClick(e)}>Send</button>
        </p>
        <p>
          <span>{`${isTyping}`}</span>
        </p>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
