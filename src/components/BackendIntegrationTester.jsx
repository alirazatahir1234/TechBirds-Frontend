import React from "react";

const BackendIntegrationTester = () => {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6 my-4">
			<h2 className="text-lg font-bold text-gray-900 mb-2">Backend Integration Tester</h2>
			<p className="text-gray-600 mb-4">Test connectivity and integration with your backend services.</p>
			<div className="flex gap-2">
				<button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Run Integration Test</button>
				<button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">View Logs</button>
			</div>
			{/* You can add more detailed integration test logic here */}
		</div>
	);
};

export default BackendIntegrationTester;
