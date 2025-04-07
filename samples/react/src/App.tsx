import { runOnMainThread } from '@lynx-js/react'
import './App.css'
import * as Sentry from '@sentry/lynx-react'

Sentry.init({
  dsn: 'https://b4d4959ce2272d9de84894b1a656db59@o447951.ingest.us.sentry.io/4509089868152832',
  // TODO: On web true causes error calling warn on undefined
  debug: true,
  beforeSend: (event, hint) => {
    console.log('beforeSend', event, hint)
    return event
  },
  integrations: (integrations) => {
    return integrations.filter((i) => i.name !== 'Dedupe')
  },
})

export function App() {
  return (
    <view>
      <view className='Background' />
      <view className='App'>
        <view className='Content'>
          <text className='Title'>Sentry</text>
          <text className='Subtitle'>on Lynx</text>
          <Button
            text="Throw an error in background thread"
            onTap={() => {
              throw new Error('Sentry uncaught error in background thread')
            }}/>
          <Button
            text="Throw an error in main thread"
            onTap={() => {
              runOnMainThread(() => {
                'main thread'
                throw new Error('Sentry uncaught error in main thread')
              })()
            }}/>
          <Button
            text="Throw an unhandled rejection"
            onTap={() => {
              Promise.reject(new Error('Sentry unhandled rejection'))
            }}/>
          <Button
            text="Capture a message"
            onTap={() => {
              Sentry.captureMessage('Sentry captured message')
            }}/>
          <Button
            text="Capture an exception"
            onTap={() => {
              Sentry.captureException(new Error('Sentry captured exception'))
            }}/>
        </view>
        <view style={{ flex: 1 }}></view>
      </view>
    </view>
  )
}

export function Button({ text, onTap }: { text: string, onTap: () => void }) {
  return (
    <view className="Button" bindtap={onTap}>
      <text className="ButtonText">{text}</text>
    </view>
  );
}