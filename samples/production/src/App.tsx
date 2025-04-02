import { useCallback } from '@lynx-js/react'

import './App.css'
import arrow from './assets/arrow.png'
import reactLynxLogo from './assets/react-logo.png'

if (__BACKGROUND__) {
  const app = (lynx as any).getApp()
  const originalHandleError = app.handleError;
  app.handleError = function(error: Error, originError?: Error, errorLevel?: any) {
    console.log('error received in handleError: ', error, originError, errorLevel)
    originalHandleError.call(app, error, originError, errorLevel)
  }
}

export function App() {
  const onTap = useCallback(() => {
    throw new Error('test error')
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