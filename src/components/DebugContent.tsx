// Debug component to test content rendering
import React from 'react';
import { useLocation } from 'react-router-dom';

const DebugContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="p-8 bg-yellow-100 border-2 border-yellow-400 m-4 rounded">
      <h1 className="text-2xl font-bold text-black mb-4">🐛 DEBUG: Content is Rendering!</h1>
      <p className="text-black mb-2">✅ Layout is working correctly</p>
      <p className="text-black mb-2">✅ Children are being rendered</p>
      <p className="text-black mb-2">🌍 Current route: <code className="bg-gray-200 px-2 py-1 rounded">{location.pathname}</code></p>
      <p className="text-black mb-4">📅 Timestamp: {new Date().toLocaleTimeString()}</p>

      <div className="bg-white p-4 rounded border">
        <h2 className="font-bold mb-2">If you can see this content:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Layout component is fixed ✅</li>
          <li>Router is working ✅</li>
          <li>Content rendering is functional ✅</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugContent;