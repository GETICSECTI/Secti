import { PrivateLayout } from '../../layouts/PrivateLayout';
import { useAuth } from '../../contexts';

export const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <PrivateLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={user?.id || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={user?.nome || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            Ready for API Integration
          </h3>
          <p className="text-yellow-800">
            This settings page is ready to be connected to your backend API. Replace
            the mock authentication service with real API calls to enable full
            functionality.
          </p>
        </div>
      </div>
    </PrivateLayout>
  );
};
