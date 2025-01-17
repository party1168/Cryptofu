import Link from "next/link";
function Navbar() {
  return (
    <nav className="border border-r-2 border-gray-600 w-64 bg-[#baa380] h-full flex flex-col justify-between">
      <div>
        <div className="font-bold text-xl text-center mt-6">
          <h1>Coinfolio</h1>
        </div>
        <div className="flex-grow-0 h-4/5">
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
      </div>
      <div className="border-t  border-gray-600 flex-grow-0 h-1/5">
            <button>
                Login
            </button>
      </div>
    </nav>
  );
}

export default Navbar;
