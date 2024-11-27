export default function SettingsPage() {
  return (
    <div className="container max-w-4xl pt-20 pb-16 px-4">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* We'll add settings sections here */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Account Settings</h2>
          {/* Account settings will go here */}
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          {/* Theme settings will go here */}
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Notifications</h2>
          {/* Notification settings will go here */}
        </div>
      </div>
    </div>
  )
} 