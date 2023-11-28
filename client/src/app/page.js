'use-client' 
import dynamic from 'next/dynamic';

export default function Home() {

  const Dynamic = dynamic(() => import('./pages/MapAwesome'), {ssr: false})
  return (
    <>

      {<div  >
        <Dynamic/>
      </div>}


    </>
  )
}
