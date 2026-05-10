// src/components/layout/Header.tsx

export function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center px-6 justify-end">
      <form>
        <button className="text-sm text-red-600 hover:text-red-800">
          Logout
        </button>
      </form>
    </header>
  );
}