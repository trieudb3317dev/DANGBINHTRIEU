export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-12 py-10 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      <div className="flex gap-4">
        <a
          href="./dashboard/categories"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Manage Categories
        </a>
        <a
          href="./dashboard/products"
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Manage Products
        </a>
      </div>

      {/* Dashboard content goes here */}
    </div>
  );
}