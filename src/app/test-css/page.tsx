export default function TestCSS() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">CSS Test Page</h1>
        <p className="text-gray-700 mb-4">If you can see this with styling, Tailwind is working!</p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Card Example</h2>
          <p className="text-gray-600">This should have a white background with shadow.</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Test Button
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-red-500 h-20 rounded"></div>
          <div className="bg-green-500 h-20 rounded"></div>
          <div className="bg-blue-500 h-20 rounded"></div>
        </div>
      </div>
    </div>
  );
}