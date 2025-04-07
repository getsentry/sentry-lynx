import "./App.css";
import "@lynx-js/web-core/index.css";
import "@lynx-js/web-elements/index.css";
import "@lynx-js/web-core";
import * as Sentry from '@sentry/lynx-react'

Sentry.init({
  dsn: 'https://b4d4959ce2272d9de84894b1a656db59@o447951.ingest.us.sentry.io/4509089868152832',
  debug: true,
  beforeSend: (event, hint) => {
    console.log('web_beforeSend', event, hint)
    return event
  }
})

const App = () => {
  return (
    <lynx-view style={{ height: "100vh", width: "100vw" }} url="/main.web.bundle">
    </lynx-view>
  );
};

export default App;
