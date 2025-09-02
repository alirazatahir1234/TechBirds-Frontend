import React from "react";

const BackendStatus = () => {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6 my-4">
			<h2 className="text-lg font-bold text-gray-900 mb-2">Backend Status</h2>
			<p className="text-gray-600 mb-4">Monitor the status of your backend services and API endpoints.</p>
			<div className="flex gap-2">
				<span className="px-4 py-2 bg-green-100 text-green-700 rounded">API: Online</span>
				<span className="px-4 py-2 bg-green-100 text-green-700 rounded">Database: Connected</span>
			</div>
			{/* You can add more detailed backend status logic here */}
		</div>
	);
};

export default BackendStatus;
