import { useCallback } from '@lynx-js/react'

import './App.css'
import arrow from './assets/arrow.png'
import reactLynxLogo from './assets/react-logo.png'

export function App() {
  const onTap = useCallback(() => {
    throw new Error('Sentry Test Error')
  }, [])
  return (
    <view>
      <view className='Background' />
      <view className='App'>
        <view className='Banner'>
          <view className='Logo' bindtap={onTap}>
            <image src={reactLynxLogo} className='Logo--react' />
          </view>
          <text className='Title'>React</text>
          <text className='Subtitle'>on Lynx</text>
        </view>
        <view className='Content'>
          <image src={arrow} className='Arrow' />
          <Button text="Send exception" onTap={onTap} />
        </view>
        <view style={{ flex: 1 }}></view>
      </view>
    </view>
  )
}

export function Button({ text, onTap }: { text: string, onTap: () => void }) {
  return (
    <view className="button" bindtap={onTap}>
      <text>{text}</text>
    </view>
  );
}