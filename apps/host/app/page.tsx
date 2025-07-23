"use client";

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function Ping(){
  const [t, setT] = useState("")

  const {isPending , error, data, refetch} = useQuery ({
    queryKey: ['ping', t],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/ping?t=${encodeURIComponent(t)}`)
      if(!res.ok) throw new Error ("NetWork Error")
      return res.json()
      },
      enabled:false,
    })
      
 const handleFetch = () => {
    refetch()
  }

  return (
    <div>
      <input
        type="text"
        value={t}
        onChange={e => setT(e.target.value)}
        placeholder="Inserisci valore t"
      />
      <button onClick={handleFetch}>
        Invia
      </button>
      {data && <p>Risposta: {data.value}</p>}
    </div>
  )
}


export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Ping />
    </QueryClientProvider>
  )
}