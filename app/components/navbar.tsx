import Link from "next/link"
function Navbar(){
    return(
        <nav className="border border-r-2 border-gray-600 w-64 bg-[#baa380] h-screen">
            <div className="font-bold text-xl text-center mt-6">
                <h1>Coinfolio</h1>
            </div>
            <div className="">
                <ul className="">
                    <li className="cursor-pointer rounded-lg m-3 p-2 border border-b text-center">
                        <Link href="/dashboard">DashBoard</Link>
                    </li>
                    <li className="cursor-pointer rounded-lg m-3 p-2 border border-b text-center">
                        <Link href="/position">Position</Link>
                    </li>
                    <li className="cursor-pointer rounded-lg m-3 p-2 border border-b text-center">
                        <Link href="/history">History</Link>
                    </li>
                    <li className="cursor-pointer rounded-lg m-3 p-2 border border-b text-center">
                        <Link href="/portfolio">Portfolio</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar