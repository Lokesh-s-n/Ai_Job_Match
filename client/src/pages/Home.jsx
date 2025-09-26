export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
        🔍 AI-Powered Job Match
      </h1>
      <p className="text-lg text-gray-700 max-w-xl text-center">
        Find jobs tailored to your skills, experience, and preferences —
        all powered by intelligent matching with Cohere AI.
      </p>
      <p className="mt-6 text-md text-gray-500">
        Please <strong>sign up</strong> or <strong>log in</strong> to get started.
      </p>
    </div>
  );
}
