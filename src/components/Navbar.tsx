"use client"
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
    const { data: session } = useSession()
    console.log(" session ->", session)
    return (
        <nav className='p-4 md:p-6 shadow-md bg-gray-900 text-white'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center max-w-6xl'>
                <a href="#" className="text-xl font-bold mb-4 md:mb-0">Mystery Message</a>
                {
                    session && session?.user ?(<>

                        <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Logout</Button> </>
                    ) : (
                        <Link href={'/sign-in'}>
                            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}