"use client";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center  bg-gradient-to-b from-rose-200 to-gray-100 font-sans text-white antialiased">
      <div className="p-8  w-full h-full flex flex-col justify-center items-center">
        <div className="container pt-12 pb-6 mx-auto text-center w-full lg:pb-20">
          <h1 className="text-3xl lg:text-5xl font-semibold text-blue-gray-900 mb-6">
            WELCOME
          </h1>
          <p className="text-xl text-gray-500 lg:w-10/12 xl:w-9/12 mx-auto">
            Welcome to our restaurant&#x27;s home page. Explore our delicious menu
            and discover a world of culinary delights.
          </p>
          <div className="grid w-full mt-8 place-items-center">
            <div className="flex flex-col w-full max-w-md gap-4 mb-2 md:flex-row">
              <div className="relative w-full">
                <input
                  className="peer w-full h-11 bg-transparent text-gray-700 border border-gray-300 rounded-md px-3 py-2 focus:border-gray-900 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <button
                className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                type="button"
              >
                Get Started
              </button>
            </div>
            <p className="text-sm text-gray-500">
              I agree to the{" "}
              <a href="#" className="font-medium underline">
                Terms and Conditions
              </a>
            </p>
          </div>
        </div>
        <div className="w-full max-w-5xl">
          <img
            src="https://bucket.material-tailwind.com/magic-ai/3582b3d039594149b4ad1a6fc541adc400f4e198f04d847dca914a1f1d4de3c7.jpg"
            alt="credit cards"
            className="h-96 w-full rounded-lg object-cover lg:h-[21rem]"
          />
        </div>
      </div>
    </div>
  );
}
