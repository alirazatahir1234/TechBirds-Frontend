import React from "react";

const FileManager = () => {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6 my-4">
			<h2 className="text-lg font-bold text-gray-900 mb-2">File Manager</h2>
			<p className="text-gray-600 mb-4">Manage your site's files and media assets here.</p>
			<div className="flex gap-2">
				<button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Upload File</button>
				<button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Browse Files</button>
			</div>
			{/* You can add more detailed file management logic here */}
		</div>
	);
};

export default FileManager;
