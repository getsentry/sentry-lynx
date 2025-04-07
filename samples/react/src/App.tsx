import './App.css'
import * as Sentry from '@sentry/lynx'

Sentry.init({
  dsn: 'https://b4d4959ce2272d9de84894b1a656db59@o447951.ingest.us.sentry.io/4509089868152832',
  // TODO: On web true causes error calling warn on undefined
  debug: true,
  beforeSend: (event, hint) => {
    console.log('beforeSend', event, hint)
    return event
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
            text="Throw an error"
            onTap={() => {
              throw new Error('Sentry uncaught error')
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