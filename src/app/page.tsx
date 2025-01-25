"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect } from "react"


export default function Dashboard() {

  const { data: session } = useSession()
  useEffect(() => {
    if (!session) {
      return 
    }
  }, [session])
  return (
    <div className=" p-4 bg-gray-100 rounded-md shadow-md w-1/2 mx-auto mt-10 text-center ">  
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4 ">Welcome {session?.user ?( session.user.username): "Guest "} </p>
      Your Dashboard is here
      <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 ml-2"> Go to Dashboard</Link> 
      </div>
  )
}


