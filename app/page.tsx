export default function Home() {
  return (
    <div className="flex flex-col justify-center h-full items-center">
      <h1 className="mt-10 pb-10 text-5xl text-black">Welcome to my project</h1>
      <div className="grid grid-cols-2 gap-10 text-black">
        <button className="bg-gradient-to-r from-purple-400 via-green-200 to-orange-600 rounded-lg text-lg p-2">
          Contact Me
        </button>
        <button className="bg-gradient-to-r from-purple-400 via-green-200 to-orange-600 rounded-lg text-lg p-2">
          information
        </button>
      </div>
    </div>
  );
}
