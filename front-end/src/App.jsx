import { BrowserView, MobileView } from 'react-device-detect';
import MainLayout from './MainLayout';
import MobLayout from './MobLayout';
import './css/App.css'

function App() {
  return (
    <>
      <BrowserView>
        <MainLayout />
      </BrowserView>
      <MobileView>
        <MobLayout />
      </MobileView>
    </>
  )
}

export default App
